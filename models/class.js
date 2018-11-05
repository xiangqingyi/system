'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    description: {
        type:String,
        required:true
    },
    className: {
        type:String,
        required:true
    }
});
mongoose.model('Class',classSchema)