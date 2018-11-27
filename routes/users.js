var express = require('express');
var MongoClient=require('mongodb').MongoClient;
var router = express.Router();
var url='mongodb://localhost:27017';
// location:3000/users
router.get('/', function(req, res, next) {
  //将用户列表给列出来
  // 操作数据库mongodb（下载mongodb包）
  // 下载：npm install --save mongodb
  MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err){
      console.log("链接数据库失败",err);
      // 
      res.render("error",{
        message:'连接数据库失败',
        error:err
      });
      // 写了return不往下面走了；
      return ;
    }
    // 输入数据库名字；得到db对象；
var db=client.db('project');
// 选择操作的集合,toArray()以数组的形式暴露出来；
db.collection('user').find().toArray(function(err,data){
  if(err){
    // 这是后台看的，控制台可以看，
    console.log("查询用户数据失败",err);
    //有错误渲染 error.ejs这个模板；
    res.render('error',{
      message:'查询失败',
      // 把错误对象传给它
      error:err
    })
  }else{
    // else就是查询成功；
  console.log(data);
  res.render('users',{
    list:data
  });
  }
  //  MongoClient.connect(url,function(err,client){,
  // 关闭数据库的连接
  client.close();

})

  });

});

module.exports = router;
