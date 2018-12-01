var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require("path");
var fs = require('fs');
var upload = multer({ dest: "c:/tmp" })
var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var async=require('async');
var url='mongodb://127.0.0.1:27017';


// =======================品牌列表==========================
router.get('/', function(req, res, next) {
    // 前端穿过来的页面，页码
  var page=parseInt(req.query.page) || 1;
  // 每页显示的条数
  var pageSize=parseInt(req.query.pageSize) || 2;
  // 总条数是哟啊查询数据库得来；
  var totalSize=0;
  MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if(err){
      res.render('error',{
        message:'链接失败',
        error:err
      })
      return;
    }
    var db=client.db('project');
    async.series([
      function(cb){
    db.collection('brand').find().count(function(err,num){
      if(err){
       cb(err)
      }else{
        totalSize=num;
        cb(null);
      }
    })
  
      },
      function(cb){
    db.collection('brand').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,data){
      if(err){
        cb(err);
      }else{
        cb(null,data);
      }
     
    })
      }
    
    ],function(err,result){
   if(err){
    res.render('error',{
      message:'错误',
      error:err
    })
   }else{
    //  总页数
    var totalPage=Math.ceil(totalSize/pageSize);
    res.render('brand',{
      list:result[1],
   totalPage:totalPage,
   pageSize:pageSize,
      currentPage:page
    })
   }
    })
  })
  
  
  });



// ====================品牌的删除==========================================

  router.get('/delete',function(req,res){
    var id=req.query.id;
    console.log(id);
    MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
      if(err){
        res.render('error',{
          message:'链接失败',
          error:err
        })
        return;
      }
      var db=client.db('project');
      db.collection('brand').deleteOne({
        _id:ObjectId(id),
    
    
      },function(err){
        if(err){
          res.render('error',{
            message:'删除失败',
            error:err
          })
        }else{
          res.redirect('/brand');
        }
        client.close();
      })
    })
    
    })


// =====================增加品牌=======================================================

    router.post('/addBrand', upload.single('lg'), function (req, res) {
      console.log("----------------------------")

        var filename = "images/" + new Date().getTime() + "_" + req.file.originalname;
        var newFileName = path.resolve(__dirname, '../public/', filename);
    console.log(filename);
        console.log(req.file);
        try {
          var data = fs.readFileSync(req.file.path);
          fs.writeFileSync(newFileName, data);
      
      
          MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
         
            if (err) {
              res.render('error', {
                message: '连接失败',
                error: err
              })
              return;
            }
            var db = client.db("project");
            db.collection('brand').insertOne({
              lg: filename,
              name: req.body.name
              
      
            }, function (err) {
              if (err) {
                res.render('error', {
                  message: '添加失败',
                  error: err
                })
              } else {
                console.log("-------");
                res.redirect('/brand');
               
              }
            })
          })
         
        } catch (error) {
          console.log(error);
           res.render('error', 
           {
            message: '添加失败',
            error: error
          }) 
        }
      })
      

module.exports = router;