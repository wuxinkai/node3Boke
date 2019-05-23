var express = require('express');
var connection=require('../model'); //数据库
//这是路由的实例
var router = express.Router();

/* 访问/执行这个回掉  这里的/是当前目录 */
router.get('/', function (req, res, next) {
  //数据渲染模版
  var articles = req.body;
  // var sql = "select * from articles";
  var sql = "select articles.`*`, category.name from articles inner join category on articles.category_id = category.id ;";
  connection.query(sql, function (err, rows, result) {
    // console.log(rows)
    if (err) {
      req.flash('error', err);
      res.redirect('back');//重定向 不成功就在这个页面
    } else {
      if (rows.length > 0) { //进行第二步判断
        res.render('index', { articles: rows });//将参数传递给前台
      } else {
        req.flash('success', '没有数据');
        res.render('index', { articles: [] })
      }
    }
  })
});

//获取总条数
router.post('/', function (req, res) {
  var sql = "select count(*) as totalCount from articles"; //返回一共多少条
  connection.query(sql, [], function (err, data) {
      if (err) {
        req.flash('error',err);
        res.redirect('back');//重定向 不成功就在这个页面
      } else {
        //获取总条数
        res.send(data[0])
      }
    });
});

//分页点击切换
// router.post('/fenye', function (req, res) {
//   var articles = req.body;
  
//   //limit分页公式：curPage是当前第几页；pageSize是一页多少条记录 limit (curPage-1)*pageSize,pageSize
//   var sql = "select * from  articles limit " + (curPage - 1) * pageSize + "," + pageSize;
//   SanGuo.query(sql, [], function (err, data) {
//     if (err) {
//       defer.reject(err);
//     } else {
//       defer.resolve(data);
//     }
//   });
// });

module.exports = router;
