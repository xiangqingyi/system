'use strict';

let mongoose = require('mongoose');
let CivetUser = mongoose.model('User');
let core = require('../libs/core');
let axios = require('axios');
let _ = require('lodash');


exports.civetcode =  async function(req, res){ 
    var config = req.app.locals.config; 
    var appid = config.civetsso.appid;
    if (!req.query.code) return res.redirect(civet_login);
    let civet_getToken = config.civetsso.getTokenURL+'?code='+req.query.code+'&appid='+appid;
    try {
        const response_Toekn = await axios.get(civet_getToken);
        if (response_Toekn.data && response_Toekn.data.access_token){
           let access_token = response_Toekn.data.access_token;
           let openid = response_Toekn.data.openid;
           let civet_getUser = config.civetsso.getUserInfoURL+'?appid='+appid+'&openid='+openid+'&access_token='+access_token;
           const response_user = await axios.get(civet_getUser);
           if (response_user.data && response_user.data.civetno){
              let civetuser = await CivetUser.findOne({'openid':openid});
              let ip = core.getIp(req);
              if (civetuser) {
                civetuser.last_login_date = new Date().getTime();
                civetuser.last_login_ip = ip;  
                civetuser.icon = response_user.data.icon;
                civetuser.save();
                req.session.user = civetuser;
                let path = core.translateHomePageDir('/');                
                let ref = req.session.loginReferer || path;                
                return res.redirect(ref);
              }else{
                let obj = _.pick(response_user.data, 'civetno', 'realname','icon');
                obj.openid = openid;
                obj.last_login_date = new Date().getTime();
                obj.last_login_ip = ip;            
                let _civetuser = new CivetUser(obj);
                civetuser = await _civetuser.save();
                if (civetuser){
                    req.session.user = civetuser;
                    let path = core.translateHomePageDir('/');                
                    let ref = req.session.loginReferer || path;                
                    return res.redirect(ref);
                }
              }
           }            
        }
      } catch (error) {
        console.log(error);
     }
     let civet_login = core.translateHomePageDir('/login');
     return res.redirect(civet_login);
};


exports.civetlogin = function(req, res, next) {  
    let civetlogin =req.app.locals.config.civetsso.authURL+'?appid='+req.app.locals.config.civetsso.appid+'&redirect_uri='+req.app.locals.config.civetsso.redirect_uri+'&scope=snsapi_userinfo';
    return res.redirect(civetlogin);
};