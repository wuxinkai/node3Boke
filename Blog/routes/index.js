var express = require('express');
var connection=require('../model'); //数据库
//这是路由的实例
var router = express.Router();

/* 访问/执行这个回掉  这里的/是当前目录 */
router.get('/', function(req, res, next) {
  //数据渲染模版
    var articles =req.body;
   var sql = "select * from articles";
   connection.query(sql,function(err,rows,result){
           // console.log(rows)
           if(err){
               req.flash('error',err);
               res.redirect('back');//重定向 不成功就在这个页面
           }else{
               if(rows.length>0){ //进行第二步判断
                   res.render('index',{articles:rows});//将参数传递给前台
               }else {
                   req.flash('success','没有数据');
                   res.redirect('/');
               }
           }
       })
});

module.exports = router;
