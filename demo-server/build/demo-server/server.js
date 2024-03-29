
let http = require('http');
let url = require("url");
let util = require("util");
let fs = require("fs");
let server = http.createServer((req,res)=>{
  res.statusCode = 200;

  // res.setHeader("Conten-Type","text/plain;charset=utf-8");
  var pathname = url.parse(req.url).pathname;
  console.log("file pathname: "+pathname)
  fs.readFile(pathname.substring(1),(err,data)=>{
    if(err){
      res.writeHeader(404,{
        'Content-type':'text/html'
      })
    }else{
      res.writeHeader(200,{
        'Content-type':'text/html'
      })
      res.write(data.toString());
    }
    res.end();
  });
}).listen(3000,'127.0.0.1',()=>{
  console.log("服务器已经运行，请打开浏览器输入http://127.0.0.1:3000来进行访问")
});
