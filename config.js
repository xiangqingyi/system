'use strict';

let appPath = process.cwd();
let config = {
    port: 9000,
    env:process.env.NODE_ENV || 'local',
    
//    mongondb信息配置
    mongodb: {
        uri: 'mongodb://127.0.0.1:27017/UserSystem',
        options: {}
    },
    // redis服务 
    redis: {
        host: '',
        port: 6379,
        pass: ''
    },
    // 日志文件目录
    path: {
        logDir: appPath + '/logs'
    }, 
    // 找回密码hash过期的时间
    findPasswordTill: 24 * 60 * 60 * 1000,
    sessionSecret: 'SessionSecret',
    // jwt 
    jwt: {
        secret: 'JWTSecretUpdate',
        options: {
            exipresIn: '10h'    // 过期时间
        }
    },
    title: 'System',
    api:{
        dir: 'system/api/v1'
    },
    homepage: {
        dir: 'system'
    },
    //后台相关配置
    admin: {
        dir: 'admin',
        role: {
            admin: 'admin',
            user: 'user'
        }
    },
    upload: {
        tmpDir: appPath +'/public/uploaded/tmp',
        uploadDir: appPath + '/public/uploaded/files',
        uploadUrl: '/uploaded/files',
        naxPostSize: 100 * 1024 * 1024,
        minFileSize: 1,
        maxFileSize: 50 * 1024 * 1024,
        acceptFileTypes: /.+/i,
        storage: {
            type: 'local', 
            options: {
                accessKey: 'The key',
                secretKey: 'The secret',
                bucket: 'The bucket',
                origin: 'http:xiangqingyi.qinniu.com', // 域名
                timeout: 360000,
            }
        }
    },
    stopForumSpam: false,
    // 是否启动用户注册校验TODO
    userVerify: {
        enable: false,
        type: 'admin'
    },
    notify: {
        enable: false,
        token: '',
        prefix: 'Foxconn'
    }

};
module.exports = config;
