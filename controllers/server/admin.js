'use strict';
const mongoose = require('mongoose');
const _ = require('lodash');
const User = mongoose.model('User');
const Notification = mongoose.model('Notification');
const Content = mongoose.model('Content');
const Categoty = mongoose.model('Category');
const Comment = mongoose.model('Comment');
const core = require('../../lib/core');
const util = require('../../lib/util');


exports.index = async (req,res) => {
    if (!req.session.user) {
        let path = core.translateAdminDir('/login');
        return res.redirect(path);
    }
    let obj = {};
    let filter = {};
    const isAdmin = req.isAdmin;
    if (!isAdmin) {
        filter = { author: req.session.user._id };
    }
    res.render('server/index',{
        title: '管理后台',
        User: req.session.user, 
        data: {
            content: await Content.count(),
            category: await Categoty.count(),
            comment: await Comment.count(),
            user: await User.count()
        }
    })

}

exports.login = async (req,res) => {
    if (req.method === 'GET') {
        req.session.loginReferer = req.headers.referer;
        res.render('server/user/login',{
            message: '请先登录'
        }) 
    } else if (req.method === 'POST') {
        const nick = req.body.nick;
        const password = req.body.password;
        const _user = await User.findOne({roles:2,nick:nick}).exec();

        if (_user) {
            // 如果存在这个就验证密码
            if (_user.password === password) {
                req.session.user = _user;
                req.session.cookie.user = _user;
                let path = core.translateAdminDir('/');
           
                return res.redirect(path)  //验证成功就跳转到主页面上
            } else {
                return res.json({
                    success: false,
                    message: "密码验证失败"
                });
            }
        } else {
            return res.json({
                success: false,
                message: '没有当前用户'
            })
        }
    }
}

exports.register = async (req,res) => {
    if (req.method === 'GET') {
        res.render('server/user/register',{
            message: '请注册账号'
        })
    } else if(req.method === 'POST') {
        const obj = _.pick(req.body,"nick","password","realname")
        const _user = await User.findOne({nick: obj.nick,roles: 2});
        if (_user) {
            // 如果存在就返回nick被占用
            return res.json({
                success: false,
                message: "该nick被占用"
            }) 
        } else {
            // 如果不存在就可以注册
            const new_admin = {
                nick: obj.nick,
                password: obj.password,
                realname: obj.realname,
                status: 1,
                roles: 2,
                description: ''
            };
            const _new_admin = await User(new_admin);
            if (_new_admin.save()) {
                res.json ({
                    success: true,
                    message: '注册成功'
                })
            } else {
                res.json ({
                    success: false,
                    message: '注册失败(保存阶段失败)'
                })
            }
        }
    }
}

// 每个admin只能接收跟自己相关的notification
// admin获取消息的 notification 列表
exports.notification_all_list = async (req, res) => {
    let condition = {};
    let user = req.session.user
    let notification_count = await Notification.count(condition);
    let pageInfo = util.createPage(req.query.page,notification_count);
    let query = await Notification.find(condition).populate('from to')
  
    util.createPage(req.query.page, notification_count);
    if(true){
        return res.render('server/notification/list',{
            Menu: 'list',
            notifications: query,
            User: req.session.user,
            own: false,
            pageInfo: pageInfo
        })
      
    }
}

// 点击单条的时候
// 可以显示单条的消息 然后在未读中移除 在已读中新增
exports.notification_one_item = async (req, res) => {
    let id = req.params.id;
    let one_item_notification = await Notification.findById(id).populate('from to');
    let test = await Notification.findOne({_id: id});
    if (!one_item_notification) {
        return res.render('server/info', {
            message: '该留言不存在'
        });
    } else {
        // 自己接收到的消息 点击加入已读
        // 获取未读的名单 判断里面是不是有自己在  
        const own = one_item_notification.to.find(x => x.id === req.session.user._id);
        if (own) {
            one_item_notification.read = [];
            one_item_notification.read.push({
                userId: req.session.user._id,
                realname: own.realname
            })
            const user = req.session.user;
            const obj = {realname: user.realname,userId: user._id}
            // remove(one_item_notification.unread,obj);
            await one_item_notification.save();
            await Notification.update({_id: id},{$pull:{unread:{realname:req.session.user.realname}}})
            res.render('server/notification/item',{
                User: req.session.user,
                notification: one_item_notification,
                title: one_item_notification.title
            })
        }


    }

}

// 自己接受到的消息
exports.notification_recevied_own = async (req,res) => {
    if (req.method === 'GET') {
        const user = req.session.user;
        const recevied_own = await Notification.find({to: user._id});
        if (recevied_own.length > 0) {
            res.render('server/notification/list',{
                Menu: 'list',
                notifications: recevied_own,
                User: req.session.user,
                own: true
            })
        } else {
            res.json({
                message: "没有接收到的消息"
            })
        }
    }
}
// 自己发出的消息（list）
exports.notification_send_own = async (req,res) => {
    if (req.method === 'GET') {
        const user = req.session.user;
        const send_own = await Notification.find({from: user._id});
        if (send_own.length > 0) {
            res.render('server/notification/list',{
                User: user,
                Menu: 'list',
                notification: send_own,
                own: true
            })
        } else {
            res.json({
                message: "没有发出的消息"
            })
        }
    }
}
// 自己发送消息 （action）
exports.notification_send = async (req,res) => {
    if (req.method === 'POST') {
        const obj = _.pick(req.body,'content','recive');
        
        const new_notification = {
            content: obj.content,
            from: req.session.user._id,
            to: obj.recive,
            broadcast: false,
            status: 1 
        }
        new_notification.unread = [];
        obj.recive.map(async (recive) => {
            const to_user = await User.findOne({_id: recive});
            new_notification.unread.push({
                userId: to_user._id,
                realname: to_user.realname
            })
        })
        // for (let i = 0; i < obj.recive.length; i++) {
        //     const to_user = await User.findOne({_id: obj.recive[i]});
        //     new_notification.unread.push({
        //         userId: to_user._id,
        //         realname: to_user.realname
        //     })
        // }
        const _new_notification = await Notification(new_notification);
        const save_new_notification = _new_notification.save();
        if (save_new_notification) {
            res.json({
                success: true,
                message: '发送成功'
            })
        } else {
            res.json({
                success: false,
                message: '发送失败'
            })
        }
    }
}



// User版块 （目前没有权限的判断 之后加）
// user列表
exports.userList =  async (req,res) => {
    if (req.method === "GET") {
        const users = await User.find({status:1});
        res.render('server/user/list', {
            title: '用户列表',
            Menu: 'list',
            users: users,
            User: req.session.user
        })
    }
}
// 编辑用户 
exports.userEdit = async (req,res) => {
    if (req.method === 'GET') {
        let id = req.params.id;
        const _user = await User.findById(id);
        if (_user) {
            res.render('server/user/edit',{
                user: _user,
                User: req.session.user
            }) 
        }
    } else if (req.method === 'POST') {
        const obj = _.pick(req.body, "e_nick", "e_realname", "e_roles");
        let id = req.params.id;
        const _user = await User.findById(id);
        if (_user) { 
            //存在才可以修改
            _.assign(_user,obj);
            _user.save();
            req.session.user = _user;
            res.render('server/info',{
                message: '更新成功'
            });
        } else {
            // 不存在就不能修改  防die
            res.render('server/info',{
                message: '用户不存在'
            })
        }
    }
}

exports.userAdd = async (req,res) => {
    if (req.method === 'GET') {
        res.render('server/user/add',{
            Menu: 'add',
            User: req.session.user
        })
    } else if (req.method === 'POST') {
        const obj = _.pick(req.body,"a_nick","a_password","a_realname","a_roles")
        const _user = await User.findOne({nick: obj.a_nick});
        if (_user) {
            res.json({
                success: false,
                message: '该昵称被占用'
            })
        } else {
            const newUser = {
                roles: obj.a_roles,
                nick: obj.a_nick,
                password: obj.a_password,
                realname: obj.a_realname
            } 
            const _newUser = await User(newUser);
            if (_newUser) {
                res.json({
                    success: true,
                    message: '添加用户成功'
                })
            }
        }
    }
}

// user单个
exports.userOne = async (req,res) => {
    if (req.method === 'GET') {
        let id = req.params.id;
        const _user = await User.findById(id);
        if (_user) {
            res.render('server/user/item',{
                user: _user
            })
        } else {
            res.render('server/info',{
                message: '该用户不存在'
            })
        }
    }
}
// user删除
exports.userDel = async (req,res) => {
    if (req.method === "GET") {
        const id = req.params.id;
        const Del_user = await User.findById(id);
        if (Del_user) {
            Del_user.status = -1;
            Del_user.save();
            res.json({
                success: true,
                message: '删除成功'
            }) 
        } else {
            res.json({
                success: false,
                message: '没有当前用户'
            })
        }
    }
}

// user 查询
exports.query = async (req,res) => {
    let kw  = req.query.q;
    const nick = await User.find({nick: new RegExp(kw, 'gi')})
    const data = nick.map((item) => {
        return  _.pick(item, '_id','nick');
    })
    if (data) {
        return res.json ({
            success: true,
            items: data
        })
    }
}
