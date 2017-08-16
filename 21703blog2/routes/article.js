//添加文章
let express = require('express');
let {checkLogin} = require('../authware');
let {Article,Category} = require('../model'); //导入数据库模块
let multer = require('multer');
let router = express.Router();
//指定文件的存储方式
let storage = multer.diskStorage({ //上传 图片应用
    //保存到哪个文件夹下
    destination: function (req, file, cb) {
        cb(null, '../21703blog2/public/uploads')
    },
    //指定保存的文件名字
    filename: function (req, file, cb) {
        cb(null, Date.now()+'.'+file.mimetype.slice(file.mimetype.indexOf('/')+1))
    }
});
//添加配置文件到muler对象。
let upload = multer({ storage: storage });

//（1）添加文章页面，
router.get('/add',checkLogin,function(req,res){
    Category.find({}, function (err, categories) {
        res.render('article/add', {title: '增加文章',categories, article:{}});
    });


});
//(1.1)把写好的文字存入数据库
router.post('/add',checkLogin,upload.single('avatar'),function (req,res) {
// router.post('/add',function (req,res) {
    let article = req.body;  //接收 发表的数据

    article.author = req.session.user._id; //获取用户  把当前登录的用户的id给author
    if(req.file){
        article.img ='/uploads/'+req.file.filename;
    }

    Article.create(article, function (err, doc) {
        if (err) {
            req.flash('error','文章发表失败');
            res.back(err);
        } else {

            res.success('文章发表成功', '/');
        }
    });
});

//在首页点击文章头部到详情页
router.get('/detail/:id',function (req,res) {
    let _id = req.params.id;
//在更新的时候获取 到 筛选的内容，
    Article.update({_id},{$inc:{pv:1}},function(err,result){
        Article.findById(_id).populate('category').exec(function (err, article) {
            res.render('article/detail',{title:'文章详情',article})
        });
    });
});
//删除详情页的文章
router.get('/delete/:id', function (req, res) {
    let _id = req.params.id;
    Article.remove({_id},function(err,result){
        if(err){
            res.back(err.toString());
        }else{
            res.success('删除文章成功','/');
        }
    })
});

//跳转的 更新 页面， 回填数据   更新和添加数据用的一个页面
router.get('/update/:id',function(req,res){
    let id = req.params.id;
    //category
    Category.find({},function(err,categories){ //查询分类
        Article.findById(id,function(err,article){ //查询内容
            if (err)
                return res.back(err);
            res.render('article/add',{title:'更新文章',article,categories});
        })
    });
});
//把更新的内容提交到数据库
router.post('/update/:id',upload.single('avatar'),function(req,res){
    let article = req.body;
    let _id = req.params.id;
    if(req.file){
        article.img ='/uploads/'+req.file.filename;
    }
    console.log(article,req.file)

    Article.update({_id},article,function(err,result){
        if(err)
            return res.back(err);
        res.success('更新文章成功',`/article/detail/${_id}`);
    });
});

module.exports = router;