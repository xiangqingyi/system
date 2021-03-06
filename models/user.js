'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    nick: {
        type:String,
        required:true
    },
    realname: {
        type:String
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,
        default: 1           // 1可用  0不可用
    },
    roles:{
        type: Number,
        default: 1           //1普通使用者 2管理员
    },
    password: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    update: {
        type: Date,
    }

})
mongoose.model('User',userSchema);