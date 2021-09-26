const checkmodule=require("../functions/check.js");
const fs=require("fs");
function generate_token(length=50){
	let temp_token=""
	for(a=0;a<length;a++){
		temp_token+=Number(Math.floor(Math.random()*36)).toString(36)
	}
	return temp_token
}
module.exports = {
	name:'connect',
	GET:(req,res,body)=>{
		let connections=JSON.parse(fs.readFileSync("/mnt/connections.json"))
		res.writeHead(200,{'Content-Type':'application/json'});
		if(connections[body.token]){
			res.write(JSON.stringify({connected:true,username:connections[body.token]}));
		}else{
			res.write(JSON.stringify({connected:false}));
		}
		res.end();
	},
	PUT:(req,res,body)=>{
		let usersdata=JSON.parse(fs.readFileSync("/mnt/users.json"))
		let connections=JSON.parse(fs.readFileSync("/mnt/connections.json"))
		if(usersdata[body["username"]]){
			if(usersdata[body["username"]]["password"]==body["password"]){
				connect_token=generate_token();
				connections[connect_token]=body["username"];
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify({token:connect_token}));
				res.end();
				fs.writeFileSync("/mnt/connections.json",JSON.stringify(connections));
			}else{
				res.writeHead(401,{'Content-Type':'application/json'});
				res.write("{error:\"Bad password\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Bad username\"}");
			res.end();
		}
	},
	DELETE:(req,res,body)=>{
		let connections=JSON.parse(fs.readFileSync("/mnt/connections.json"))
		delete connections[body.token];
		res.writeHead(204,{'Content-Type':'application/json'});
		res.end();
		fs.writeFileSync("/mnt/connections.json",JSON.stringify(connections));
	}
}