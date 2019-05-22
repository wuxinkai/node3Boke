var express = require('express');
var connection=require('../model'); //数据库
var validate = require('../middle/index.js');//设置权限
var router = express.Router();//生成一个路由实力

/* 注册 git请求获取表单内容 */
router.get('/reg', function(req, res, next) {
  //渲染模版，同时也执行里send方法
  res.render('user/reg')
});
//提交用户表达
router.post('/reg',validate.checkNotLogin ,function(req, res, next) {
    var userData=req.body;
    console.log(userData.username)
    console.log(userData.password)
var sql = "insert into user(username,password) values('"+userData.username+"','"+userData.password+"')";
connection.query(sql,function(err,rows,result){
    console.log(rows)
    console.log(result)
    if(err){
        req.flash('error',err)
        res.redirect('back');//重定向 不成功就在这个页面
    }else{
        req.session.user=rows;//导航修改成增加 分类 退出
        req.flash('success','注册成功')
        res.redirect('/');//成功就跳转到 首页
    }
});


});


/*登录 当用户get请求 /user/reg的时候 执行回调*/
router.get('/login',validate.checkNotLogin, function(req, res, next) {
    var userData=req.body;// 获取提交内容
    res.render('user/login')
});

router.post('/login',validate.checkNotLogin, function(req, res, next) {
    var userData=req.body;// 获取提交内容
    var sql = "select * from user where username=? and password=?"
    connection.query(sql,[userData.username,userData.password],function(err,rows,result){
        console.log(rows)
        if(err){
            req.flash('error',err)
            res.redirect('back');//重定向 不成功就在这个页面
        }else{
            if(rows.length>0){
                req.session.user=rows; //导航修改成增加 分类 退出
                req.flash('success','登陆成功');
                res.redirect('/');//成功就跳转到 首页
            }else {
                req.flash('success','没有此用户');
                res.redirect('back');
            }

        }
    })
});

//退出登录
router.get('/logout',validate.checkLogin, function(req, res, next) {
     req.session.user =null;
    res.redirect('/')
});


module.exports = router;
