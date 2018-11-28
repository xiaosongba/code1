var express = require('express');
var MongoClient=require('mongodb').MongoClient;
var ObjectId=require('mongodb').ObjectId;
var async=require('async');
var router = express.Router();
var url='mongodb://localhost:27017';

router.get('/', function(req, res, next) {
  // 前端穿过来的页面，页码
var page=parseInt(req.query.page) || 1;
// 每页显示的条数
var pageSize=parseInt(req.query.pageSize) || 5;
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
  db.collection('user').find().count(function(err,num){
    if(err){
     cb(err)
    }else{
      totalSize=num;
      cb(null);
    }
  })

    },
    function(cb){
  db.collection('user').find().limit(pageSize).skip(page*pageSize-pageSize).toArray(function(err,data){
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
  res.render('users',{
    list:result[1],
 totalPage:totalPage,
 pageSize:pageSize,
    currentPage:page
  })
 }
  })
})

//   MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
//     if(err){
//       console.log("链接数据库失败",err);
//       // 
//       res.render("error",{
//         message:'连接数据库失败',
//         error:err
//       });
//       // 写了return不往下面走了；
//       return ;
//     }
//     // 输入数据库名字；得到db对象；
// var db=client.db('project');
// // 选择操作的集合,toArray()以数组的形式暴露出来；
// db.collection('user').find().toArray(function(err,data){
//   if(err){
//     // 这是后台看的，控制台可以看，
//     console.log("查询用户数据失败",err);
//     //有错误渲染 error.ejs这个模板；
//     res.render('error',{
//       message:'查询失败',
//       // 把错误对象传给它
//       error:err
//     })
//   }else{
//     // else就是查询成功；
//   console.log(data);
//   res.render('users',{
//     list:data
//   });
//   }
//   //  MongoClient.connect(url,function(err,client){,
//   // 关闭数据库的连接
//   client.close();

// })

//   });

});

// 登入操作
router.post("/login",function(req,res){
  console.log(req.body);
  // { name: 'asdfg', pwd: 'ASDFG' }
var username=req.body.name;
var password=req.body.pwd;
// 验证参数的有效性
if(!username){
  res.render('error',{
    message:'用户名不能为空',
    // 因为这里没有err,所以自己new一个
    error:new Error('用户名不能为空')
  })
  return;
}
if(!password){
  res.render('error',{
    message:'密码不能为空',
    // 因为这里没有err,所以自己new一个
    error:new Error('密码不能为空')
  })
  return;
}
// 链接数据库
MongoClient.connect(url,{useNewUrlParser:true},function(err,client){
  if(err){
    console.log("链接失败",err);
    res.render('error',{
      message:'链接失败',
      error:err
    })
    return;
  }
  var db=client.db('project');


db.collection('user').find({
  username:username,
  password:password
}).toArray(function(err,data){
  if(err){
    console.log('查询失败',err);
    res.render('error',{
      message:'查询失败',
      error:err
    })
  }else if(data.length<=0){
    // data.length<=0说明没找到这个人；这就是一个空数组；
          res.render('error',{
        message:'登入失败',
        error:new Error('登入失败')
      })
  }else{
    // 这里就是登入成功

    res.cookie('nickname',data[0].nickname,{
      // 设置毫秒数；（让cookie保存10分钟）
      maxAge:10*60*1000
    })


    // 登入成功就回到首页；
    res.redirect('/')
  }
})
})
//res.send('');注意这里，因为mongodb的操作时异步操作

})
// 注册操作
// 地址是localhost:3000/users/register
router.post('/register',function(req,res){

  var name=req.body.name;
  var pwd=req.body.pwd;
  var age=req.body.age;
  var sex=req.body.sex;
  var nickname=req.body.nickname;
  // 数据库里存的是逻辑值
  var isAdmin=req.body.isAdmin==="是"?true:false;
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
      db.collection('user').find({username:name}).count(
        function(err,num){
          if(err){
            cb(err)
          }else if(num>0){
            // 这个人已经注册过了；
            // 注册下面异步函数不用走了，所以传一个错误信息过去
            cb(new Error('已经注册'))

          }else{
            // 到这里说明可以注册，就让它走到下面去
            cb(null);
          }
        }
      )
    },
    function(cb){
db.collection('user').insert({
  "username" : name,
      "password" : pwd,
      "nickname" : nickname,
      "sex" : sex,
      "age" : parseInt(age),
      "isAdmin" : isAdmin
},function(err){
  if(err){
   cb(err);
  }else{
    // 注册成功就null；
    cb(null);
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
      // 注册成功
      res.redirect('/login.html');
    }
    // 不管成功还是失败，做个关闭操作
    client.close();
  })

})

})

// 删除的操作
// localhost:3000/ures/delete

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
  db.collection('user').deleteOne({
    _id:ObjectId(id),


  },function(err){
    if(err){
      res.render('error',{
        message:'删除失败',
        error:err
      })
    }else{
      res.redirect('/users');
    }
    client.close();
  })
})

})








module.exports = router;
