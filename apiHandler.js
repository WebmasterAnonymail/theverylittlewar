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
			if(body==""){
				let url=new URL("http://"+req.headers.host+req.url);
				let searchDatas={};
				for(const [key,value] of url.searchParams.keys()) {
					searchDatas[key]=value;
				}
				console.log(searchDatas);
				body=JSON.stringify(searchDatas);
			}
			api[name][req.method](req,res,body);
		}else{
			res.writeHead(405);
			res.write('405');
			res.end();
		}
	}
}