let user = require('./User');
console.log(`userName:${user.userName}`);
console.log(`say:${user.sayHello()}`);
let http = require('http');
let url = require("url");
let util = require("util");
let server = http.createServer((req,res)=>{
  res.statusCode = 200;

  res.setHeader("Conten-Type","text/plain;charset=utf-8");

  //parse就是把url转成对象
  //inspect是把url对象展开
  res.end(util.inspect(url.parse(req.url)));
}).listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行，请打开浏览器输入http://127.0.0.1:3000来进行访问")
});
