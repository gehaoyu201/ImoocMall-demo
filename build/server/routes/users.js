var express = require('express');
var router = express.Router();
require('../util/util')
var User = require('./../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post('/login',function(req,res,next){
  var param = {
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }
  User.findOne(param,function(err,doc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(doc){
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        });
        // req.session.user = doc;
        res.json({
          status: '0',
          msg:'',
          result:{
            userName:doc.userName
          }
        })
      }else{
        //账户密码没有在数据库中找到，所以返回的是空
        res.json({
          status: '1',
          msg:'账户名或密码错误',
          result:''
        })
      }
    }
  })
});

//登出接口
router.post("/logout",(req,res,next)=>{
  res.cookie("userId","",{
    path:'/',
    maxAge: -1
  });
  res.json({
    status:'0',
    msg:"",
    result:''
  });
});

router.get("/checkLogin",function(req,res,next){
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:req.cookies.userName
    })
  }else{
    res.json({
      status:'1',
      msg:'未登录',
      result:''
    })
  }
});
//查询当前用户的购物车数据
router.get('/cartList',(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:doc.cartList
        })
      }
    }
  })
});

//购物车删除
router.post("/cartDel",(req,res,next)=>{
  var userId = req.cookies.userId,productId = req.body.productId;
  User.update({userId:userId},
    {
      $pull:{
        'cartList':
          {'productId':productId}
      }
    },(err,doc)=>{
      if(err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else{
        if(doc){
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      }
    });
});

//购物车edit功能
router.post("/cartEdit",(req,res,next)=>{
  var userId = req.cookies.userId,
      productId = req.body.productId,
      productNum = req.body.productNum,
      checked = req.body.checked;
  User.update({"userId":userId,"cartList.productId":productId},{
    "cartList.$.productNum" : productNum,
    "cartList.$.checked":checked
  },(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      });
    }else{
      if(doc){
        res.json({
          status:'0',
          msg:'',
          result:'suc'
        });
      }
    }
  });
});
//全选功能
router.post("/cartAll",(req,res,next)=>{
  var userId = req.cookies.userId,
      checkAll = req.body.checkAll?'1':'0';
  User.findOne({userId:userId},(err,user)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(user){
        user.cartList.forEach((item)=>{
          item.checked = checkAll;
        })
      }
      user.save((err,doc)=>{
        if(err){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'1',
            msg:'',
            result:'suc'
          })
        }
      })
    }
  });
});
//查询商品地址接口
router.get('/addressList',(req,res,next)=>{
  var userId = req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      res.json({
        status:'0',
        msg:'',
        result:doc.addressList
      });
    }
  })
});
//地址列表设置默认
router.post('/setDefault',(req,res,next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      var addressList = doc.addressList;
      addressList.forEach(item=>{
        if(item.addressId == addressId){
          item.isDefault = true;
        }else{
          item.isDefault = false;
        }
      })
      doc.save((err1,doc1)=>{
        if(err1){
          res.json({
            status:'1',
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:''
          })
        }
      });
    }
  });
});
//删除地址
router.post('/delAddress',(req,res,next)=>{
  var addressId = req.body.addressId;
  var userId = req.cookies.userId;
  User.update({userId:userId},
    {
      $pull:{
        'addressList':
          {'addressId':addressId}
      }
    },(err,doc)=>{
      if(err) {
        res.json({
          status: '1',
          msg: err.message,
          result: ''
        })
      }else{
        if(doc){
          res.json({
            status:'0',
            msg:'',
            result:'suc'
          })
        }
      }
  });
});
//添加新的地址功能
router.post('/newAdd',(req,res,next)=>{
  var userId = req.cookies.userId;
  var userName = req.body.userName,
      streetName = req.body.streetName,
      postCode = req.body.postCode,
      tel = req.body.tel;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    }else{
      if(doc){
        var addressList = doc.addressList;
        var length = addressList.length;
        if(length == 0){
          var addressId = '100001'
        }else{
          var addressId = parseInt(addressList[length - 1].addressId) + 1;
        }
        var obj = {
          addressId:addressId,
          userName:userName,
          streetName:streetName,
          postCode:postCode,
          tel:tel,
          isDefault:false
        }
        doc.addressList.push(obj);
        doc.save((err,doc)=>{
          if(err){
            res.json({
              status: '1',
              msg: err.message,
              result: ''
            })
          }else{
            res.json({
              status: '0',
              msg: '',
              result: 'suc'
            })
          }
        })
      }
    }
  })
});
//创建订单
router.post("/payment",(req,res,next)=>{
  var userId = req.cookies.userId;
  var addressId = req.body.addressId;
  var orderTotal = req.body.orderTotal;
  var orderId = '';
  var createData = '';
  var addressInfo = '';
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      doc.addressList.forEach((item)=>{
        if(item.addressId == addressId){
          addressInfo = item;
        }
      });
      var goodsList = [];
      doc.cartList.forEach(item=>{
        if(item.checked == 1){
          goodsList.push(item);
        }
      });
      var platform = '622';
      var r1 = Math.floor(Math.random()*10);
      var r2 = Math.floor(Math.random()*10);
      var sysDate = new Date().Format('yyyyMMddhhmmss');
      createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
      orderId = platform + r1 + sysDate + r2;
      var obj = {
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:addressInfo,
        goodsList:goodsList,
        orderStatus:'1',
        createDate:createDate
      };
      doc.orderList.push(obj);
      doc.save((err,doc)=>{
        if(err){
          res.json({
            status:"1",
            msg:err.message,
            result:''
          })
        }else{
          res.json({
            status:'0',
            msg:'',
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }
      });
    }
  });
});
//查询商品订单接口
router.post("/orderList",(req,res,next)=>{
  var userId = req.cookies.userId;
  var orderId = req.body.orderId;
  var orderList = [];
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message,
        result:''
      })
    }else{
      if(doc){
        doc.orderList.forEach(item=>{
          if(item.orderId == orderId){
              orderList = item;
          }
        });
        res.json({
          status:'0',
          msg:'',
          result:{
            orderList:orderList
          }
        })
      }
    }
  })
});
//查询购物车数量
router.get('/getCartCount',(req,res,next)=>{
  var userId = req.cookies.userId;
  if(userId){
    User.findOne({userId:userId},(err,doc)=>{
      if(err){
        res.json({
          status:'1',
          msg:err2.message,
          result:''
        });
      }else{
        if(doc){
          res.json({
            status:'0',
            msg:'',
            result:doc.cartList
          })
        }
      }
    })
  }
});
module.exports = router;
