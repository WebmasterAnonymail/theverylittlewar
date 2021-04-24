const fs=require("fs");
module.exports=function(req,res){
    let url=req.url;
    if(url=="/"){
        url="/main.html";
    }
    try{
        file=fs.readFileSync("view"+url);
        res.writeHead(200);
        res.write(file);
        res.end();
    }catch(err){
        if(err.code=='ENOENT'){
            res.writeHead(404);
            res.write("404");
            res.end();
        }else{
            res.writeHead(500);
            res.write("500");
            res.end();
        }
    }
    
}