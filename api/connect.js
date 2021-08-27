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
		let connections=require("/mnt/connections.json");
		let bd=JSON.parse(body);
		res.writeHead(200,{'Content-Type':'application/json'});
		if(connections[bd.token]){
			res.write(JSON.stringify({connected:true,username:connections[bd.token]}));
		}else{
			res.write(JSON.stringify({connected:false}));
		}
		res.end();
	},
	PUT:(req,res,body)=>{
		let usersdata=require("/mnt/users.json");
		let connections=require("/mnt/connections.json");
		let bd=JSON.parse(body);
		if((usersdata[bd["username"]]["password"]==bd["password"])&&usersdata[bd["username"]]){
			connect_token=generate_token();
			connections[connect_token]=bd["username"];
			res.writeHead(200,{'Content-Type':'application/json'});
			res.write(JSON.stringify({token:connect_token}));
			res.end();
			fs.writeFileSync("/mnt/connections.json",JSON.stringify(connections));
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.end();
		}
	},
	DELETE:(req,res,body)=>{
		let bd=JSON.parse(body);
		let connections=require("/mnt/connections.json");
		delete connections[bd.token];
		res.writeHead(204,{'Content-Type':'application/json'});
		res.end();
		fs.writeFileSync("/mnt/connections.json",JSON.stringify(connections));
	}
}