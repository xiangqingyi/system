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
router.route('/user').all(server.userList);
router.route('/user/:id/edit').all(server.userEdit);
router.route('/user/add').all(server.userAdd); 


module.exports = function(app) {
    let path = core.translateAdminDir('/');
    app.use(path,router)
}