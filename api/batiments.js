const fs=require("fs");
const checkmodule=require("../functions/check.js");
module.exports = {
	name:'batiments',
	POST:function(req,res,body){
		let users=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			if(users[body_data.username].batiments[body_data.batiment]){
				switch(body_data.batiment){
					case "generateur":
						
						break;
					case "producteur":
						
						break;
					case "stockage":
						
						break;
					default:
						
						break;
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
	}
}
