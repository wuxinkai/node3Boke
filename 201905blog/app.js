var express = require('express');
var path = require('path');//处理路径
var favicon = require('serve-favicon');//处理收藏夹图标
var logger = require('morgan');//写日志
var cookieParser = require('cookie-parser');//解析cookie
var bodyParser = require('body-parser'); //解析请求体
var session = require('express-session');//登陆用户保存到session属性上


flash = require('connect-flash'); //消息通知 依赖session
var index = require('./routes/index');//夹在路由
var users = require('./routes/users');
var category = require('./routes/category'); //分类管理
var articles = require('./routes/articles');



var app = express();

//设置模版文件的存放路径
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');


//模板的存放路径
app.set('views',path.join(__dirname,'views'));
//设置模板引擎
app.set('view engine','html');
//设置如果模板是html的话，使用ejs引擎的渲染方法来进行渲染
app.engine('html',require('ejs').renderFile);

//把项目根目录下面的node_modules作为静态文件根目录
app.use(express.static('node_modules'));
// app.use(express.static('public'));

app.use(session({
    secret:'wxk',
    resave:true,
    saveUninitialized:true
}));

//flash是依赖session的
app.use(flash());//消息通知

//把收藏夹的图标放在public下
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//解析请求体 通过请求头的Content-Type
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
//处理静态文件中间件  指定静态文件目录
app.use(express.static(path.join(__dirname, 'public')));



app.use(function(req,res,next){
    // res.locals 是真正渲染模板的数据对象，res.locals代替了
    res.locals.user = req.session.user;//从coolie中获取内容 session是数据库返回值存到了cookie中

  //flash 通知消息 成功和失败
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    // res.locals.keyword = ''; //存储搜索关键字
    next();
});

//路由配置非常重要  /是一级目录
app.use('/', index);//当路由走/的时候，跳转到index文件下
app.use('/users', users);  //users.js
app.use('/articles', articles);
app.use('/category',category);//如果访问的路径是以/category开头的

// 捕获404的错误，转发错误处理中间件里去
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


//模块拆分
//用户相关
//目录相关的
//文章相关的
