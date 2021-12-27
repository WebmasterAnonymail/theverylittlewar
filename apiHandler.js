const fs=require('fs');
const checkmodule=require("./functions/check.js");
const toSlice='/api/v1/';
var api={};
var files=fs.readdirSync('./api');
if(!files){
	console.error('[Err] Aucun fichier d\'api chargé');
}
for(let i in files){
	let prop=require(`./api/${files[i]}`);
	api[prop.name]=prop;
}
module.exports=function(req,res,body){
	let url=new URL("http://"+req.headers.host+req.url);
	let name=url.pathname.slice(toSlice.length);
	if(!api[name]) {
		res.writeHead(501,{'Content-Type':'application/json'});
		res.write("{error:\"not api with name '"+name+"' found\"}");
		res.end();
	}else{
		if(api[name][req.method]){
			let bodydatas={};
			if(body){
				bodydatas=JSON.parse(body);
			}
			for(const [key,value] of url.searchParams) {
				bodydatas[key]=value;
			}
			checkmodule.eventcheck();
			checkmodule.gamecheck();
			try{
				api[name][req.method](req,res,bodydatas);
			}catch (error){
				res.writeHead(500);
				res.end();
				console.error(error);
			}
		}else{
			res.writeHead(405);
			res.write('405');
			res.end();
		}
	}
}