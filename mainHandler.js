let apiVersion='v1';
const apiHandler=require('./apiHandler.js');
const staticHanlder=require("./staticHandler");
const wsHanlder=require("./wsHanlder");
module.exports.http=function(req,res){
    if(req.url.startsWith(`/api/${apiVersion}/`)){
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
module.exports.ws=wsHanlder.connect;