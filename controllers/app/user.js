'use strict';
let mongoose = require('mongoose')
let User = mongoose.model('User')
let util = require('../../lib/util');
let core = require('../../lib/core')


// 首先是登录的是界面
exports.login = async (req,res) =>{
    
    if (req.method === 'GET') {
        res.render('app/login',{
            message: '请先登录'
        })
    } else if (req.method === 'POST') {

    }

}
exports.register = async (req,res) => {
    if (req.method === 'GET') {
        res.render('app/register',{
            message:'请先注册',
            user: req.session.user
        })
    }
}
exports.adminList = async (req,res) => {
    if(req.method === 'GET') {
        const adminList = await User.find({roles: 2});
        // if (adminList) {
        //     res.json ({
        //         success: true,
        //         adminList: adminList,
        //         message: 'Get Success'
        //     })
        // } else {
        //     res.json ({
        //         success: false,
        //         message: 'no data'
        //     })
        // }
        if (adminList) {
            res.render('app/adminList',{
                message: 'Get success',
                admins: adminList
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