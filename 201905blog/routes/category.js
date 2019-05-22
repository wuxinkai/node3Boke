// 分类文章
let express = require('express');
var connection = require('../model'); //数据库
let router = express.Router();
var items = []
router.get('/list', function (req, res) {
  //读取添加后的列表
  var sql = "select * from category";
  connection.query(sql, function (err, rows) {
    if (err) {
      console.log(err)
    } else {
      res.render('category/list', {
        categories: rows
      });
    }
  });
});

router.get('/add', function (req, res) {
  res.render('category/add', {
    title: '添加分类'
  });
});

router.post('/add', function (req, res) {
  let categoryCanshu = req.body;
  var sql = "select * from category where name=?";
  connection.query(sql, [categoryCanshu.name], function (err, rows, result) {
    if (err) {
      req.flash('error', err)
      res.redirect('back');
    } else {
      if (rows.length > 0) {
        req.session.user = rows;
        req.flash('success', '该账户已经被注册过');
        res.redirect('/category/add');
      } else {
        // 插入内容
        var sql = "insert into category(id,name) values('" + categoryId()+ "','" + categoryCanshu.name + "')";
        connection.query(sql, function (err, rows, result) {
          if (err) {
            req.flash('error', err);
            res.redirect('back');
          } else {
            req.flash('success', '插入成功');
            res.redirect('/category/list');
          }
        });
      }
    }
  })
});

function categoryId() {
  var outTradeNo = ""; //订单号
  for (var i = 0; i < 6; i++) { ////6位随机数，用以加在时间戳后面。
    outTradeNo += Math.floor(Math.random() * 10);
  }
  return outTradeNo
}

 //删除国家
router.get('/delete/:id', function(req, res, next) {
  var  sql = "delete from category where id=?";
  connection.query(sql,[req.params.id],function(err,rows){
      console.log(rows);
      if (err){
          console.log(err);
          res.redirect('back');
      }else {
          req.flash('success','删除成功');
          res.redirect('/category/list');  //删除后将新数据返回
      }
  });
});


module.exports = router;