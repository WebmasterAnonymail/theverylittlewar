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
		connections=require("../storage/connections.json");
		body_data=JSON.parse(body);
		res.writeHead(200,{'Content-Type':'application/json'});
		if(connections[body_data.token]){
			res.write(JSON.stringify({connected:true,username:connections[body_data.token]}));
		}else{
			res.write(JSON.stringify({connected:false}));
		}
		res.end();
	},
    PUT:(req,res,body)=>{
		usersdata=require("../storage/users.json");
		connections=require("../storage/connections.json");
		body_data=JSON.parse(body);
		if((usersdata[body_data["username"]]["password"]==body_data["password"])&&usersdata[body_data["username"]]){
			connect_token=generate_token();
			connections[connect_token]=body_data["username"];
			res.writeHead(200,{'Content-Type':'application/json'});
			res.write(JSON.stringify({token:connect_token}));
			res.end();
			fs.writeFileSync("../storage/connections.json",JSON.stringify(connections));
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.end();
		}
	},
	DELETE:(req,res,body)=>{
		body_data=JSON.parse(body);
		connections=require("../storage/connections.json");
		delete connections[body_data.token];
		fs.writeFileSync("../storage/connections.json",JSON.stringify(connections));
	}
}