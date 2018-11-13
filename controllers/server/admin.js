'use strict';
const mongoose = require('mongoose');
const _ = require('lodash');
const User = mongoose.model('User');
const Notification = mongoose.model('Notification');
const core = require('../../lib/core');

exports.login = async (req,res) => {
    if (req.method === 'GET') {
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
                return res.redirect('......');  //验证成功就跳转到主页面上
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