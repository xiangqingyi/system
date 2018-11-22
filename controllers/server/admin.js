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
    // Promise.all([
    //     Content.find(filter).count.exec(),
    //     Categoty.find(filter).count.exec(),
    //     Comment.find(filter).count.exec(),
    //     User.find(filter).count.exec()
    // ]).then((result) => {
    //     res.render('server/index',{
    //         title: '管理后台',
    //         data: {
    //             content: result[0],
    //             category: result[1],
    //             comment: result[2],
    //             user: result[3],
    //         }
    //     })
    // }).catch((error) => {
    //     console.log(error.message);
    // })
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
exports.notification_recevied_list = async (req, res) => {
    let condition = {};
    let user = req.session.user
    // condition.to = req.session.user._id;//(当只有一个接收者的时候)
    const notification_count = await Notification.count(condition);
    let query = await Notification.find(condition).populate('from, to')
    let to_users = await Notification.to.find(x => x._id === user._id);
    let pageInfo = util.createPage(req.query.page, notification_count);
    if(to_users){
        query.skip(pageInfo.start);
        query.limit(pageInfo.pageSize);
        query.sort({created: -1});
        query.exec((err, results) => {
            if (err) {
                res.json({
                    success: false,
                    message: '获取列表信息失败'
                });
            } else {
                return res.render('server/notification/list',{
                    Menu: 'list',
                    notification: results,
                    pageInfo: pageInfo
                })
            }
        })
    }
}

// 点击单条的时候
// 可以显示单条的消息 然后在未读中移除 在已读中新增
exports.notification_one_item = async (req, res) => {
    let id = req.params.id;
    let one_item_notification = await Notification.findById(id);
    if (!one_item_notification) {
        return res.render('server/info', {
            message: '该留言不存在'
        });
    } else {
        // 对于这条notification在未读中移除 在已读中新增
        // unread_user 获取已经移除自己的unread名单
        const unread_user = _.remove(one_item_notification.unread,user => (user.userId === req.session.user._id));
        if (unread_user) {
            // 增加read名单
            one_item_notification.read.push({
                userId: req.session.user._id,
                realname: (await User.findOne({_id: req.session.user._id})).realname
            })
            res.json({
                success: true,
                message: '移除unread and 新增read成功'
            })
        } 
        res.render('server/notification/item',{
            title: one_item.content,
            notification: one_item_notification
        })
    }
}

