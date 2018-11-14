'use strict';
let express = require('express');
let mongoose = require('mongoose');
let gravatar = require('gravatar');
let path = require('path');
let favicon = require('serve-favicon');
let compression = require('compression')
let logger = require('morgan');
let session = require('express-session');
let RedisStore = require('connect-redis')(session); //存储session,防止服务重启后session丢失
let bodyParser = require('body-parser');
let csrf = require('csurf');
let moment = require('moment');
let _ = require('lodash');
// let config = require('./config/config');
let config = require('./config');
let core = require('./lib/core');
// let util = require('./lib/util');

let cookieParser = require('cookie-parser');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');

let app = express();
let appPath = process.cwd();
app.use(compression());
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.uri,{useNewUrlParser: true}).then(function(db) {
  console.log("mongo连接成功");
},function(err) {
  console.log('mongo连接失败',err)
})

// 载入数据模型
core.walk(appPath + '/models',null,function(path) {
  require(path);
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 定义全局字段
app.locals = {
  title: config.title || 'System',
  pretty: true,
  moment: moment,
  _: _,
  homepage: config.homepage.dir,
  core: core,
  config: config,
  gravatar: gravatar,
  env: config.env
}
app.set('config',config);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(session({
  resave:true,
  cookie:{
    maxAge: 123456789
  },
  saveUninitialized: true,
  secret: config.sessionSecret || 'system',
  store: (config.redis.host ? new RedisStore(conf.redis) : null) 
}))
core.walk(appPath + '/routes/api','middlewares',function(path){
  require(path)(app);
});

app.use(csrf());
app.use(function(req,res,next) {
  res.header('X-Powered-By','superxqy');
  res.locals.token = req.csrfToken && req.csrfToken();
  res.locals.query = req.query;
  if(req.session && req,session.user) {
    const roles = util.getRoles(req.session.user);
    const actions = util.getActions(req.session.user);
    req.user = req.session.user;
    req.isAdmin = req.session.user.status === 101;
    req.Roles = roles;
    req.Actions = actions;
    res.locals.Actions = actions;
    res.locals.User = req.session.user;
  } else {
    req.user = null;
    req.isAdmin = null;
    req.Roles = null;
    req.Actions = null;
    res.locals.Actions = null;
    res.locals.User = null;
  }
  next();
});
//路由控制

core.walk(appPath + '/routes/app','middlewares',function(path) {
  require(path)(app);
});
// core.walk(appPath + '/routes/server','middlewares',function(path) {
//   require(path)(app)
// })

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set('port', process.env.PORT || config.port || 7000);
let server = app.listen(app.get('port'), function() {
    core.logger.info('網站服務啟動，端口： ' + server.address().port);
    core.logger.info('環境變數： ' + config.env);
    core.logger.info('mongodb url： ' + config.mongodb.uri);
    core.logger.info('redis url： ' + config.redis.host + ':' + config.redis.port);        
});


module.exports = app;
