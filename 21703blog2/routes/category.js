// 分类文章
let express = require('express');
let {Category} = require('../model');
let router = express.Router();
router.get('/list',function(req,res){
    //读取添加后的列表
    Category.find({},function(err,categories){
        console.log(categories);
        res.render('category/list',{title:'分类管理',categories});
    });

});

router.get('/classify',function(req,res){
    res.render('category/classify',{title:'添加分类'});
});
router.post('/classify',function(req,res){
    let category = req.body;
    //先查询是否添加过
    Category.findOne(category,function(err,oldCategory){
        if(err){
            res.back(err);
        }else{
            if(oldCategory){
                res.back('分类名称已经存在，请换个名称吧');
            }else{
                Category.create(category,function(err,doc){
                    if(err){
                        res.back(err);
                    }else{

                        res.success('分类添加成功','/category/list');
                    }
                })
            }
        }
    });
});

//通过id删除内容
router.get('/delete/:_id',function (req,res) {
    let _id = req.params._id;
    Category.remove({_id},function (err,result) {
        if(err){
            res.back(err)
        }else {
            res.success(`删除${_id}分类成功`,'/category/list')
        }
    })
});

module.exports = router;