let express = require('express'); //框架
let bodyParse = require('body-parser'); //前端传递后台值
let session = require('express-session'); //存储功能 判断是否登录
let  MongoStore = require('connect-mongo')(session); //把内容存到数据库

//文件夹路径中间件
let flash = require('connect-flash'); //消息通知
let user =require('./routes/user'); //登录和注册
let category = require('./routes/category'); //分类管理
let article = require('./routes/article'); // 增加文章
let index = require('./routes/index'); //首页
let  path = require('path'); //获取路径
let app =express(); //启动express

//前台传递后台参数用的
app.use(bodyParse.json()); //会往请求对象上增加一个属性；
app.use(bodyParse.urlencoded({extended:'true'}));

app.use(session(
    {
        resave:true,//每次请求结束重新保存session
        saveUninitialized:true,//保存未初始化的session
        secret:'wxk123456',//加密cookie的秘钥
        //指定session数据的存放位置，可能是内存、文件系统、数据库
        store:new MongoStore({url:'mongodb://127.0.0.1/myBlog'})
    }
));
//flash是依赖session的
app.use(flash());//消息通知

//未处理------------------------
app.use(function(req,res,next){
    // res.locals 是真正渲染模板的数据对象
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    res.locals.keyword = ''; //存储搜索关键字
    next();
});
app.use(function(req,res,next){
    res.success = function(msg,url){
        req.flash('success',msg);
        res.redirect(url);
    };
    res.error = function(err,url){
        req.flash('error',err);
        res.redirect(url);
    };
    res.back = function(err){
        res.error(err.toString(),'back');
    };
    next();
});
//------------------------

app.set('view engine','html'); //设置模板引擎
app.set('views',path.resolve('views')); //模板的存放路径
app.engine('html',require('ejs').__express); //设置如果模板是html的话，使用ejs引擎的渲染方法来进行渲染

app.use(express.static('node_modules')); //static很容易写错 把项目根目录下面的node_modules作为静态文件根目录
app.use(express.static('public')); //可以设置多个


//url路由中间件
app.use('/',index); //index 引用的是上面let index = require('./routes/index');路径
app.use('/user',user); //中间件第一个参数是路径的前缀，
app.use('/category',category);//如果访问的路径是以/category开头的
app.use('/article',article); //如果访问的路径是以/article开头的




app.listen(3000,function () {
    console.log('3000');
});



