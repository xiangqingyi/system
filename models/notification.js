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
        ref: 'user'
    },
    to: [{
        type: Schema.ObjectId,
        ref:'user'
    }],
    broadcast: {
        type:Boolean,
        default:false
    },
    type: {
        type: String,
        default: ''
    },
    // 已读
    read: [{
        type: Schema.ObjectId,
        ref:'user'
    }],
    unread: [{
        type: Schema.ObjectId,
        ref:'User'
    }],
    deleted: [{
        type:Schema.ObjectId,
        ref:'User'
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