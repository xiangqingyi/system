'use strict';

const mongoose =require('mongoose');
const Schema = mongoose.Schema;

const userinfoSchema = new Schema({
    realname: {
        type:String,
        required:true
    },
    address: {
        type:String,
        required:true
    },
    tel: {
        type:Number,
        required:true
    },
    class:{
        type: Schema.ObjectId,
        ref: 'class'
    }
})

mongoose.model('UserInfo',userinfoSchema);