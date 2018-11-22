'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Notification = mongoose.model('Notification');
const core = require('../../../lib/core');

exports.login = async (req,res) => {
    const nick = req.body.nick;
    const password = req.body.password;
    const _user = await User.findOne({nick: nick});   
    if(req.method === 'POST') {
        if (_user) {
            // 已存在就登陆
             if (_user.password === password) {
                 req.session.user = _user;
                 let path = core.translateHomePageDir('/');
                 return res.redirect(path);
                //  return res.json({
                //      success: true,
                //      message: '登录成功'
                //  })

             } else {
                 return res.json({
                     success:false,
                     message: '密码验证失败'
                 })
             }
        } else {
            // 不存在这个账号
            return res.json({
                success: false,
                message: '此账号不存在'
            })
        }
    } else if (req.method === 'GET') {
        res.render('/app/login')
    }
}

exports.register = async (req,res) => {
   const nick = req.body.nick;
   const realname = req.body.realname;
   const password = req.body.password;
   const repassword = req.body.repassword;

   const _user = await User.findOne({nick: nick});
   if (req.method === "POST") {
       if (_user) {
        //    已经存在
        return res.json({
            success: false,
            message: '这个昵称已经存在'
        }) 
       } else {
        //    不存在就注册
           const newuser = {
               nick: nick,
               realname: realname,
               password: password,
               repassword: repassword,
           }
           let _newuser = await User(newuser);
           if(_newuser.save()) {
               res.json({
                   success: true,
                   message: '用户创建成功'
               })
           } else {
               res.json({
                   success: false,
                   message: '用户创建失败'
               })
           }
       }
   } else if (req.method === 'GET') {
       res.render('/app/register')
   }
}

// 获取admin列表
exports.adminList = async (req,res) => {
    if(req.method === 'GET') {
        const adminList = await User.find({roles: 2});
        if (adminList) {
            res.json ({
                success: true,
                adminList: adminList,
                message: 'Get Success'
            })
     
        } else {
            res.json ({
                success: false,
                message: 'no data'
            })
        }
    } else if (req.method === 'POST') {

    }
}

// user端只有发送消息的功能  （接收消息）
// user端 notification 
exports.AllNotification  = async (req,res) => {
    if (req.method === 'GET') {
        // 目前还没写到admin
        // const to_id = req.body.to_id;
        const to_id = req.params.id;
        const receive_notification = await Notification.find({to: to_id});
        if (receive_notification) {
            res.json({
                success: true,
                message: '接收成功'
            })
        } else {
            res.josn({
                success: false,
                message: '接收失败'
            })
        }
    } else if (req.method === 'POST') {
        const user = req.session.user;
        // const to_id = req.body.adminId;
        const content =  req.body.content;
        const from_id = req.params.id;
        const to_ids = req.body.receive;
        // const from_user = await User.find({_id: user_id});
        const new_notification = {
            content: content,
            from: from_id,
            to: to_ids,
            broadcast: false,
            status: 1,
        }
        new_notification.unread = [];
        for(let i = 0; i < to_ids.length; i++) {
            const to_user = await User.findOne({_id: to_ids[i]});
            new_notification.unread.push({
                userId: to_user._id,
                realname: to_user.realname
            })
        }
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