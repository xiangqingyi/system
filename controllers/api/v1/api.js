'use strict';
const mongoose = require('mongoose');
const User = mongoose.model('User');


exports.login = async (req,res) => {
    const nick = req.body.nick;
    const password = req.body.password;
    const _user = await User.find({nick: nick});   
    if(req.method === 'POST') {
        if (_user) {
            // 已存在就登陆
             if (_user.password === password) {
                 req.session.user = _user;
                 return res.json({
                     success: true,
                     message: '登录成功'
                 })
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
        res.render('app/login')
    }
}

exports.register = async (req,res) => {
   const nick = req.body.nick;
   const realname = req.body.realname;
   const password = req.body.password;
   const repassword = req.body.repassword;

   const _user = await User.find({nick: nick});
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
       res.render('app/register')
   }
}