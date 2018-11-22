'use strict';
let mongoose = require('mongoose')
let User = mongoose.model('User')
let util = require('../../lib/util');
let core = require('../../lib/core')
let _ = require('lodash')


// 首先是登录的是界面
exports.login = async (req,res) =>{
    
    if (req.method === 'GET') {
        return res.render('app/login',{
            message: '请先登录'
        })
    } else if (req.method === 'POST') {
        const obj = _.pick(req.body,"nick","password")
        const _user = await User.findOne({nick: obj.nick});
        if (_user) {
            if (_user.password === obj.password) {
                req.session.user = _user;
                let path = core.translateHomePageDir('/');
                return res.redirect(path)
            } else {
                return res.json({
                    success: false,
                    message: '密码验证失败'
                })
            }
        } else {
            return res.json({
                success: false,
                message: '此账号不存在'
            })
        }
    }

}
exports.register = async (req,res) => {
    if (req.method === 'GET') {
        res.render('app/register',{
            message:'请先注册',
            user: req.session.user
        })
    } else if (req.method === 'POST') {
        const obj = _.pick(req.body,"nick","realname","password","repasswrod");
        const _user = await User.findOne({nick: obj.nick});
        if (_user) {
            return res.json({
                success: false,
                message: '这个昵称已经存在'
            })
        } else {
            const newuser = {
                nick: obj.nick,
                realname: obj.realname,
                password: obj.password
            }
            let _newUser = await User(newuser);
            if (_newUser.save()) {
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
    }
}
exports.adminList = async (req,res) => {
    if(req.method === 'GET') {
        const adminList = await User.find({roles: 2});
        if (adminList) {
             res.render('./app/adminList',{
                message: 'Get success',
                admins: adminList,
                user: req.session.user
            })
        }
    }  
}
exports.check = (req, res, next) => {
    if (!req.session.user) {
        let path = core.translateHomePageDir('/login');
        req.session.loginReferer = req.originalUrl;
        return res.redirect(path);
    }
    next();
};