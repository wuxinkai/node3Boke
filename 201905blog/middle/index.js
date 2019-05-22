//设置权限的页面
//必须登陆后才能访问
exports.checkLogin=function (req,res,next) {
    if(req.session.user){
        next()
    }else {
        req.flash('error','未登陆')
        res.redirect('/users/login')
    }
};

exports.checkNotLogin=function (req,res,next) {
    if(req.session.user){
        req.flash('error','已 登陆')
        res.redirect('/')
    }else {
     next()
    }
};