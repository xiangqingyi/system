'use strict';

const express = require('express');
const router = express.Router();
const api = require('../../controllers/api/v1/api');
const core = require('../../lib/core');

// router.use(function(req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*')
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//     res.setHeader('Access-Control-Allow-Headers', 'X-Request-With,content-type,Authorization')
//     res.setHeader("Cache-Control", "private, no-store");
//     next();
// });
router.route('/user/register')
      .post(api.register);
router.route('/user/login')
      .post(api.login);
router.route('/adminAll')
     .all(api.adminList)
router.route('/notification/:id')
     .all(api.AllNotification)

module.exports = function(app) {
    let path = core.translateAPIDir('/');
    app.use(path,router);
}