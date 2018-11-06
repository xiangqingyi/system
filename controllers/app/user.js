'use strict';
let mongoose = require('mongoose')
let User = mongoose.model('User')
let util = require('../../lib/util');


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