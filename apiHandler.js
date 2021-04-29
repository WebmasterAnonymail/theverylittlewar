const fs=require('fs');
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
	let name=req.url.slice(toSlice.length);
	if(!api[name]) {
		res.writeHead(400);
		res.write('400');
		res.end();
	}else{
		if(api[name][req.method]){
			api[name][req.method](req,res,body);
		}else{
			res.writeHead(405);
			res.write('405');
			res.end();
		}
	}
}