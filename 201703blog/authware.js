//登录后才能访问
exports.checkLogin = function(req,res,next){
  if(req.session.user){//如果当前用户的会话对象中有user属性
    next();
  }else{
    res.flash('error','未登录');
    res.redirect('/user/signin');
  }
}
//未登录用户才能访问，比如 注册和 登录
exports.checkNotLogin = function(req,res,next){
  if(req.session.user){//如果已经登录了，则跳转到首页 /
    res.redirect('/');
  }else{
    next();//执行下一个中间件或者路由
  }
}