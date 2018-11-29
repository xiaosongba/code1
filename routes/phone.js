var express = require('express');
var multer=require("multer");
var upload=multer({dest:"c:/tmp"})
var router = express.Router();
var fs=require('fs');
var path=require
var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var async=require('async');

var url='mongodb://localhost:27017';
// 数据的列表数据;
router.get("/",function(req,res){
    var page=parseInt(req.query.page) || 1;
    var pageSize=parseInt(req.query.pageSize) || 2;
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
        db.collection('phone').find().count(function(err,num){
          if(err){
           cb(err)
          }else{
            totalSize=num;
            cb(null);
          }
        })
      
          },
          function(cb){
        db.collection('phone').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,data){
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
        res.render('phone',{
          list:result[1],
       totalPage:totalPage,
       pageSize:pageSize,
          currentPage:page
        })
       }
        })
      })
      
      
      })
// 手机删除的操作
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
    db.collection('phone').deleteOne({
      _id:ObjectId(id),
  
  
    },function(err){
      if(err){
        res.render('error',{
          message:'删除失败',
          error:err
        })
      }else{
        res.redirect('/phone');
      }
      client.close();
    })
  })
  
  })
// 新增手机
router.post('/addPhone',upload.single('src'),function(req,res){
console.log(req.file);
console.log("");
res.send("");


})





// 修改手机列表数据；
router.get('/updata',function(req,res){
  
  var id=req.query.id;
  
  console.log(id);
  res.send("");
  // MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
  //   if(err){
  //     res.render('error',{
  //       message:'链接失败',
  //       error:err
  //     })
  //     return;
  //   }
  //   var db=client.db('project');
  //   db.collection('phone').deleteOne({
  //     _id:ObjectId(id),
  
  
  //   },function(err){
  //     if(err){
  //       res.render('error',{
  //         message:'删除失败',
  //         error:err
  //       })
  //     }else{
  //       res.redirect('/phone');
  //     }
  //     client.close();
  //   })
  // })
  
  })




module.exports = router;
