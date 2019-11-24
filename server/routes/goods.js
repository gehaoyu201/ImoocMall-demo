var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');
//连接mongodb数据库
mongoose.connect('mongodb://127.0.0.1:27017/dumall');
mongoose.connection.on('connected',function () {
  console.log('mongo success');
});
mongoose.connection.on('error',function () {
  console.log('mongo error');
});
mongoose.connection.on('disconnected',function () {
  console.log('mongo fail');
});
//查询商品列表数据
router.get("/list",function (req,res,next) {
  let page = parseInt(req.param('page'));
  let pageSize = parseInt(req.param('pageSize'));
  let priceLevel = req.param("priceLevel");
  let sort = req.param("sort");
  let skip = (page-1)*pageSize;
  let params = {};
  var priceGte = '',priceLte = '';
  if(priceLevel != 'all'){
    switch(priceLevel){
      case '0' : priceGte = 0;priceLte = 1000;break;
      case '1' : priceGte = 1000;priceLte = 2000;break;
      case '2' : priceGte = 2000;priceLte = 3000;break;
      case '3' : priceGte = 3000;priceLte = 4000;break;
    }
    params = {
      salePrice:{
        $gte:priceGte,
        $lte:priceLte
      }
    }
  }

  let goodsModel = Goods.find(params).skip(skip).limit(pageSize);
  goodsModel.sort({'salePrice':sort});
  goodsModel.exec(function(err,doc){
    if(err){
      res.json({
        status:1,
        msg:err.message
      });
    }else{
      res.json({
        status:0,
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  });
});
//加入到购物车
router.post("/addCart",function(req,res,next){
  var userId = '100000077',productId = req.body.productId;
  var User = require('../models/user');
  User.findOne({userId:userId},function(err,userDoc){
    if(err){
      res.json({
        status:'1',
        msg:err.message
      });
    }else{
      console.log('userDoc:'+userDoc);
      if(userDoc){
        let goodsItem = '';
        userDoc.cartList.forEach((item)=>{
          if(item.productId == productId){
            goodsItem = item;
            item.productNum ++;
          }
        });
        if(goodsItem){
          userDoc.save(function(err2,doc2){
            if(err2){
              res.json({
                status:'1',
                msg:err2.message
              });
            }else{
              console.log('doc2:'+doc2);
              res.json({
                status:'0',
                msg:'',
                result:"suc"
              });
            }
          });
        }else{
          Goods.findOne({productId:productId},function(err1,doc){
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              });
            }else{
              if(doc){
                var obj = {
                  productId:doc.productId,
                  productName:doc.productName,
                  salePrice:doc.salePrice,
                  productImage:doc.productImage,
                  checked:1,
                  productNum:1
                }
                doc = obj;
                // doc.checked = 1;
                // doc.productNum = 1;
                // console.log("checekd:"+doc.checked+"productNum:"+doc.productNum);
                // console.log("doc:"+doc);
                userDoc.cartList.push(doc);
                userDoc.save(function(err2,doc2){
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message,
                      result:''
                    });
                  }else{
                    console.log('doc2:'+doc2);
                    res.json({
                      status:'0',
                      msg:'',
                      result:"suc"
                    });
                  }
                });
              }
            }
          });
        }
      }
    }
  });
});
module.exports = router;
