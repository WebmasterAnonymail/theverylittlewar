const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports={
	name:'console',
	PATCH:(req,res,body)=>{
		response=[]
		for(a of body){
			try{
				response.push(eval(a.toString()));
			}catch(err){
				response.push({erreur:err.stack});
			}
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	},
	OPTIONS:(req,res,body)=>{
		try{
			let response=fs.readdirSync(body.path);
			res.writeHead(200,{'Content-Type':'application/json'});
			res.write(JSON.stringify(response));
			res.end();
			
		}catch(err){
			if(err.code=="EPERM"){
				res.writeHead(403);
				res.end();
			}else if(err.code=="EISDIR"){
				res.writeHead(406);
				res.end();
			}else if(err.code=="ENOENT"){
				res.writeHead(404);
				res.end();
			}else{
				res.writeHead(500);
				res.end();
			}
		}
	},
	GET:(req,res,body)=>{
		try{
			let response=String(fs.readFileSync(body.path));
			res.writeHead(200,{'Content-Type':'text/plain'});
			res.write(response);
			res.end();
		}catch(err){
			if(err.code=="EPERM"){
				res.writeHead(403);
				res.end();
			}else if(err.code=="EISDIR"){
				res.writeHead(406);
				res.end();
			}else if(err.code=="ENOENT"){
				res.writeHead(404);
				res.end();
			}else{
				res.writeHead(500);
				res.end();
			}
		}
	},
	PUT:(req,res,body)=>{
		try{
			fs.writeFileSync(body.path,body.content);
			res.writeHead(200);
			res.end();
		}catch(err){
			if(err.code=="EPERM"){
				res.writeHead(403);
				res.end();
			}else if(err.code=="EISDIR"){
				res.writeHead(406);
				res.end();
			}else if(err.code=="ENOENT"){
				res.writeHead(404);
				res.end();
			}else{
				res.writeHead(500);
				res.end();
			}
		}
	}
}
