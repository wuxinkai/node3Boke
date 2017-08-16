// 登录和注册
let express = require('express');
let crypto  = require('crypto'); //加密
let {User2} = require('../model'); //User是数据库接口
let {checkLogin,checkNotLogin}= require('../authware'); //引入权限管理
let multer = require('multer'); // 上传文件中间件
//此文件路径应该是相对于server.js所在目录 也就是说相对于启动的入口文件
//指定文件的存储方式
let storage = multer.diskStorage({ //上传 图片应用
    //保存到哪个文件夹下
    destination: function (req, file, cb) {
        cb(null, '../21703blog2/public/imgs')
    },
    //指定保存的文件名字
    filename: function (req, file, cb) {
        console.log(file.mimetype.slice(file.mimetype.indexOf('/')+1))
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
});
//添加配置文件到muler对象。
let upload = multer({ storage: storage });

let router = express.Router();

//注册的 登录页
router.get('/signup',checkNotLogin,function(req,res){
    res.render('user/signup',{title:'用户注册'}); //渲染模板
});
//注册的 提交页面
router.post('/signup',checkNotLogin,upload.single('avatar'),function(req,res){ //,upload.single('avatar')  不写  user获取不到内容
    let user = req.body;
    console.log(req.file)
    user.password=md5(user.password); //注册加密
    if(req.file){
        user.avatar ='/imgs/'+req.file.filename;
    }

    // console.log(user);
    User2.findOne({username:user.username},function(err,oldUser){//先从数据中查询，我注册的这个名字（user.username）是否有人注册过， 也可以查user.email，是否注册过
        // 分为六种种情况
        // （1）接受不到后台数据
        // （2）能够接收数据，
        // （3）接收到的数据被注册，
        // （4）接收到数据没有被注册
        //  (5) 接收到数据没有被注册 ，但是注册的时候失败
        //  (6) 接收到数据没有被注册 ，注册成功
        console.log(oldUser);
        if(err){ //（1）接受不到后台数据 路由跳转到上一级目录
            req.flash('error',err);
            res.redirect('back');
        }else { //（2）能够接收数据，
            if(oldUser){ //（3）接收到的数据被注册，
                req.flash('error','这个用户名已经有人用了，你换个用户名吧');
                res.redirect('back');
            }else { //（4）接收到数据没有被注册
                User2.create(user,function(err,doc){
                    if(err){  //  (5) 接收到数据没有被注册 ，但是注册的时候失败
                        res.redirect('back');
                    }else{  //  (6) 接收到数据没有被注册 ，注册成功
                        res.redirect('/user/signin');
                    }
                });
            }

        }
    });

});


router.get('/signin',checkNotLogin,function(req,res){
    res.render('user/signin',{title:'登录界面'});
});
router.post('/signin',checkNotLogin,function(req,res){
    let user = req.body; //获取前端传过来的数据库
    user.password=md5(user.password); //查询加密
    // console.log(user);
    //向数据库查询内容
    User2.findOne(user,function (err,doc) {
        if(err){
            req.flash('error',err);
            res.redirect('back');
        }else {
            if(doc){//如果doc有值，则表示查到数据了，如果没有值null则表示没有查找
                //如果登录成功之后，会把对象放到会话中去
                //session是跨请求保存数据
                req.flash('success','恭喜你登录成功');
                // console.log(doc)
                req.session.user = doc; //把从数据库中查询到的数据，保存到session中，
                res.redirect('/'); //登录成功返回到首页
            }else {
                req.flash('error','登录失败');
                res.redirect('back'); //登录失败还在当前页
            }
        }
    })
});

//退出页面
router.get('/signout',checkLogin,function(req,res){
    req.session.user = null; //退出清空session 这样就不会有保存内容
    res.redirect('/user/signin');
});

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

module.exports = router;