const fs=require("fs");
const checkmodule=require("../functions/check.js");
module.exports = {
	name:'batiments',
	POST:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let events=require("/mnt/events.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			if(users[body_data.username].batiments[body_data.batiment]){
				switch(body_data.batiment){
					case "generateur":
						
						break;
					case "producteur":
						
						break;
					case "stockage":
						if(
						users[body_data.username].ressources.energie>=10**(users[body_data.username].batiments.stockage/15)*100
						||users[body_data.username].ressources.carbone>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.oxygene>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.azote>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.iode>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.brome>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.hydrogene>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.soufre>=10**(users[body_data.username].batiments.stockage/15)*10
						||users[body_data.username].ressources.chlore>=10**(users[body_data.username].batiments.stockage/15)*10
						){
							event_amel={
								"username":body_data.username,
								"time":(new Date()).getTime()+(Math.log2(users[body_data.username].batiments.stockage+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"stockage",
							};
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
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
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	}
}
