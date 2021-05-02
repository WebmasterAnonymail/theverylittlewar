const fs=require('fs');
const checkmodule=require("../functions/check.js");
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
		res.writeHead(400);
		res.write('400');
		res.end();
	}else{
		if(api[name][req.method]){
			if(body==""){
				let searchDatas={};
				for(const [key,value] of url.searchParams) {
					searchDatas[key]=value;
				}
				body=JSON.stringify(searchDatas);
			}
			try{
				checkmodule.eventcheck();
				api[name][req.method](req,res,body);
			}catch (error){
				res.writeHead(500,{'Content-Type':'application/json'});
				res.write(JSON.stringify(error));
				res.end();
			}
		}else{
			res.writeHead(405);
			res.write('405');
			res.end();
		}
	}
}