var express = require('express');

var connection=require('../model'); //数据库
//这是路由的实例
var router = express.Router();

var multer = require('multer');//上传图片
//图片上传指定元素的存储方式
var storage = multer.diskStorage({
    //指定图片上传的位置路径
    destination: function (req, file, cb) {
        cb(null, '../public/images')
    },
    //指定保存的文件名
    filename: function (req, file, cb) {
        cb(null,  Date.now()+ file.mimetype.slice(file.mimetype.indexOf('/')+1)) //截取图片的名字 mimetype: 'image/jpeg'
    }
});

var upload = multer({ storage: storage });

/* 请求一个空白的发表文章页面 */
router.get('/add', function(req, res, next) {
    res.render('articles/add',{article:{}});
});
//提交文章数据
router.post('/add',upload.single('img'), function(req, res, next) {
    var articles =req.body;


    var user = req.session.user;// 获取作者
     articles.user = user;//把页面登陆存储的作者给 articles这个对象

    var myDate = new Date();
    // +myDate.toLocaleTimeString(); //   可以获取当前时间
    //可以获取当前日期
    console.log(articles)
    if(articles.createAt==''){ //页面没有输入值的时候才走这个
        articles.createAt =  myDate.toLocaleDateString()
    }

    if(req.file){
        articles.imgs = '/images/'+req.file.filename;//将文件路径存入数据库
    }
    var sql = "insert into articles(title,content,createAt,imgs) values('"+articles.title+"','"+articles.content+"','"+articles.createAt+"','"+articles.imgs+"')";
    connection.query(sql,function(err,rows,result){
        if(err){
            req.flash('error',err);
            res.redirect('back');//重定向 不成功就在这个页面
        }else{
            req.flash('success','登陆成功');
            res.redirect('/');//成功就跳转到 首页
        }
    });
});

//文章详情页
router.get('/detail/:id', function(req, res, next) {
    var  sql = "select * from articles where id=?";
    connection.query(sql,[req.params.id],function(err,rows){
        if (err){
            console.log(err)
        }else {
            if(rows.length>0){
                console.log(rows[0].RowDataPacket);
                res.render('articles/detail',{article:rows[0]});
            }else {
                console.log("没有这个账户")
            }
        }
    });
});

//删除文章
router.get('/delete/:id', function(req, res, next) {
    var  sql = "delete from articles where id=?";
    connection.query(sql,[req.params.id],function(err,rows){
        console.log(rows);
        if (err){
            console.log(err);
            res.redirect('back');
        }else {
            req.flash('success','删除成功');
            res.redirect('/');  //删除后将新数据返回
        }
    });
});

//修改页面
router.get('/update/:id', function(req, res, next) {
    var  sql = "select * from articles where id=?";
    connection.query(sql,[req.params.id],function(err,rows){
        if (err){
            console.log(err)
        }else {
            if(rows.length>0){
                console.log(rows[0].RowDataPacket);
                res.render('articles/add',{article:rows[0]});
            }else {
                console.log("没有这个账户")
            }
        }
    });
});
router.post('/update/:id',upload.single('img'), function(req, res, next) {
    var articles =req.body;

    articles.id=articles.ids;

    if(req.file){
        articles.imgs = '/images/'+req.file.filename;//将文件路径存入数据库
    }
    console.log(articles);
    sql = "update articles set createAt='"+articles.createAt+"',title='"+articles.title+"',content='"+articles.content+"' where id='"+req.params.id+"'"
    connection.query(sql,function(err,rows){
        if (err){
            console.log(err);
            req.flash('error','更新失败');
            res.redirect('back');
        }else {
            req.flash('success','更新成功');
            res.redirect('/');
        }
    });
});

module.exports = router;
