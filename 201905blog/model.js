var mysql =require('mysql');
var connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    // password:'123123', //家里数据库密码
    password:'123456', //公司数据库密码
    database:'student'//数据库的名字
})
connection.connect();

//查询内容
// var sql = 'select * from user'
// connection.query(sql,function (err,rows,fields) {
//     if(err){
//         console.log(err)
//     }else {
//         console.log(rows)
//        // console.log(fields)
//         rows.forEach(function (value) {
//
//         })
//     }
// })


//插入内容
// var username = 'zhangsan';
// var password = '123456';
// var sql = "insert into user(username,password) values('"+username+"','"+password+"')";
// connection.query(sql,function(err,result){
//     if(err)
//         console.error(err);
//     else{
//         console.log(result);
//     }
// });

//问号传参 查询


module.exports = connection;