var http = require('http');
let util = require('util');
http.get('http://www.kuaidi100.com/query?type=yuantong&postid=11111111111',(res)=>{
  let data = '';
  res.on("data",(chunk)=>{
    data += chunk;
  });
  res.on("end",()=>{
    try{
      let result = JSON.parse(data);
      result = util.inspect(result);
      console.log("result:" + result);
    }catch(e){
      console.error(e.message);
    }
  });
});
