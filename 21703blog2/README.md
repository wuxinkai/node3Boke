# 珠峰博客
## 初始化项目
```
npm init -y
```
## 安装依赖的模块
```
npm install express body-parser bootstrap connect-flash connect-mongo debug ejs express-session mongoose multer -S
```

## 配置路由
### 用户管理
- 用户注册
- 用户登录
- 用户退出

### 文章分类管理
- 创建分类
- 分类列表
- 删除分类

### 文章管理
- 创建文章
- 修改文章
- 删除文章
- 查询文章
- 评论文章

##　实现路由
### 用户路由
```
/user/signup 注册
/user/signin 登录
/user/signout 退出
```
### 文章分类路由
```
/category/list 分类列表
/category/add 增加分类
/category/delete/:id 删除分类
```
### 文章路由
```
/article/add 增加文章
/article/delete/:id 删除文章
```
###文件夹的内容
```
server.js   //服务器启动和所有文件夹加载都在这里执行
authware.js //是页面跳转权限的控制
model.js    //mongdb数据库
views       //模板文件夹  include公共头和尾
routers     //存放  注册和登录user  首页展示内容index     分类管理category   增加文章article
public      //存放静态文件的 ，img css  
```

## 数据库结构
### 用户集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|用户名|username|字符串|
|密码|password|字符串|
|邮箱|email|字符串|
|头像|avatar|字符串|

### 文章分类集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|分类名称|name|字符串|

### 文章集合
|字段名称|字段名|字段类型|
|:----|:----|:----|
|文章标题|title|字符串|
|文章内容|content|字符串|
|作者|author|ID类型|
|发表时间|createAt|日期|

###关键词语的用途 和注意点
（1）res.render('/',{参数}) //指定连接哪个url  把数据填充进模板，一般数据是JSON，模板是views目录下的模板文件
（2）模板中不能有注释
（3）<%include ./include/header.html%>   //指定公共头部和尾部  
（4）在注册的时候 form表单必须是 enctype="multipart/form-data" method="post" 
（5）必须有name属性  name="username" 
（6）图片的属性 name="avatar"
 (7)表单提交的时候不添加 multer和upload模块还有upload.single('avatar')；提交表单是不会出现内容的
（8） 缺少图片提交的内容 我们要把input的file改成我们想要的  user.avatar = `/${req.file.filename}`;


