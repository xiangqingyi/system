'use strict';

const express = require('express');
const router = express.Router();
const core = require('../../lib/core');
const server = require('../../controllers/server/admin');


router.route('/login').all(server.login);
router.route('/register').all(server.register);
router.route('/').get(server.index);  
router.route('/user').all(server.userList);
router.route('/user/query').all(server.query);
router.route('/user/:id/edit').all(server.userEdit);
router.route('/user/add').all(server.userAdd); 
router.route('/user/:id/del').all(server.userDel);
router.route('/notification').all(server.notification_all_list);
router.route('/notification/send').all(server.notification_send_own)
router.route('/notification/add').all(server.notification_send);
router.route('/notification/recived').all(server.notification_recevied_own)
router.route('/notification/:id').all(server.notification_one_item);


module.exports = function(app) {
    let path = core.translateAdminDir('/');
    app.use(path,router)
}