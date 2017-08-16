let express = require('express'); //导出模块用
let {Article} = require('../model'); //数据库
let markdown = require('markdown').markdown;
let router = express.Router(); //再移入  搭建导入导出模型

//开始文章部分， 要求页面加加载就要读到数据
router.get('/',function(req,res){
    //搜索
    let {keyword,pageNum,pageSize} = req.query;
    let query = {};

    pageNum = isNaN(pageNum)?1:parseInt(pageNum);//当前页码
    pageSize = isNaN(pageSize)?3:parseInt(pageSize);//每页的条数

    if(keyword){
        let reg =new RegExp(keyword);
        query = {$or:[{title:reg},{content:reg}]}; //title:reg 搜索标题   {content:reg} 搜索内容
    }
    console.log(keyword,pageNum,pageSize);

    Article.count(query,function(err,count){
        Article.find(query).sort({createAt:-1}).skip((pageNum-1)*pageSize).limit(pageSize).populate('author').exec(function(err,articles){
            res.render('index',{
                title:'首页',
                keyword,
                totalPage:Math.ceil(count/pageSize),
                pageNum,
                pageSize,
                articles});
        });
    })


});

module.exports =router;







