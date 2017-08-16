let mongoose = require('mongoose'); //1.引入mongoose
mongoose.Promise = Promise; //使用es6原生的Promise库替代掉mongoose使用的Promise库
let ObjectId = mongoose.Schema.Types.ObjectId;
//2.连接数据库
//conn是连接对象
let conn = mongoose.createConnection('mongodb://127.0.0.1/myBlog'); //myBlog是数据库集合的名字
//3.定义schema
//4.定义model
//如果不通过collection给定user,那么集合名称=模型名->小写(user)->复数(users)
exports.User2 = conn.model('User', new mongoose.Schema({
    username: String,//用户名 字段的名字  String字段的类型
    password: String,//密码
    email: String,//邮箱
    avatar: String//头像
    /*
     字段类型
     String 字符串
     Number 数字
     Date 日期
     Buffer 缓冲区
     Boolean 布尔值
     Mixed  混合
     Objectid 对象ID
     Array  数组
     */
}));

//增加文章，
exports.Article =conn.model('Article', new  mongoose.Schema({
    title:'String', //标题
    content:{type:String}, //正文
    img:'String', //保存图片，
    author:{type:ObjectId,ref:'User'},//作者  User和数据库的名字对应 外键 别的集合的主键 ref-reference引用，当前元素的id要引用 User2的内容
    category:{type:ObjectId,ref:'Category'},//链接筛选，存储的是筛选的id
    pv:{type:Number,default:0},
    createAt:{type:Date,default:Date.now} //发表日期 默认是当前时间
}));

//分类
exports.Category = conn.model('Category',new mongoose.Schema({
    name:String // 分类名称 类型是字符串
}));