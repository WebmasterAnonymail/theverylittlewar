const fs=require("fs");
const ext_types={
	"html":"text/html",
	"css":"text/css",
	"js":"application/javascript",
	"svg":"image/svg+xml",
	"png":"image/png",
	"jpg":"image/jpeg",
	"ico":"image/x-icon",
	"gif":"image/gif",
	"ttf":"font/ttf"
};
module.exports=function(req,res){
	let url=req.url;
	if(url=="/"){
		url="/main.html";
	}
	extension=url.substring(url.lastIndexOf('.')+1);
	try{
		file=fs.readFileSync("view"+url);
		res.writeHead(200,{'Content-Type':ext_types[extension]});
		res.write(file);
		res.end();
	}catch(err){
		if(err.code=='ENOENT'){
			res.writeHead(404);
			res.write("404");
			res.end();
		}else{
			res.writeHead(500);
			res.write("500 : "+err.toString());
			res.end();
		}
	}
}