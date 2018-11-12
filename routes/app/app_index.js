'use strict';

const express = require('express');
const router = express.Router();
const api = require('../../controllers/api/v1/api');
const app = require('../../controllers/app/user');
const core = require('../../lib/core');

// router.use(function(req, res, next) {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
//   res.setHeader('Access-Control-Allow-Headers', 'X-Request-With,content-type,Authorization')
//   res.setHeader("Cache-Control", "private, no-store");
//   next();
// });
router.route('/login')
  .all(app.login);
router.route('/register')
  .all(app.register)
router.route('/adminlist')
  .get(app.check,app.adminList);

  module.exports = function(app) {
      let path = core.translateHomePageDir('/');
      app.use(path,router);
  }