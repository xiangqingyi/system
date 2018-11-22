'use strict';

const express = require('express');
const router = express.Router();
const core = require('../../lib/core');
const server = require('../../controllers/server/admin');

// 
router.route('/login')
   .all(server.login);
router.route('/register')
   .all(server.register);
router.route('/').get(server.index);   


module.exports = function(app) {
    let path = core.translateAdminDir('/');
    app.use(path,router)
}