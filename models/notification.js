'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    from: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    // 目前是一次只能给一个用户发送消息
    to: [{
        type: Schema.ObjectId,
        ref:'User'
    }],
    broadcast: {
        type:Boolean,
        default:false
    },
    // 已读用户
    read: [{
        type: Schema.Types.Mixed
    }],
    // 未读用户
    unread: [{
        type: Schema.Types.Mixed
    }],
    // 已删除用户
    deleted: [{
        type: Schema.Types.Mixed
    }],
    created:{
        type: Date,
        default: Date.now
    },
    status: {
        type: Number,    
        default: 0
    }
});
mongoose.model('Notification',NotificationSchema);