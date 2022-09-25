let apiVersion='v1';
const fs=require('fs');
const apiHandler=require('./apiHandler.js');
const staticHanlder=require("./staticHandler");
module.exports=function(req,res){
	if(dbs_getting_progress<5){
		res.writeHead(503,{});
		res.end();
	}else if(req.url.startsWith(`/api/${apiVersion}/`)){
		let body=[]
		req.on('data',function(chunk){
			body.push(chunk);
		})
		req.on('end',function(){
			body=Buffer.concat(body).toString();
			apiHandler(req,res,body);
		});
	}else{
		staticHanlder(req,res);
	}
}
