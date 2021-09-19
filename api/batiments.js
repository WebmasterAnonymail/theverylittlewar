const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'batiments',
	POST:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync("/mnt/users.json"))
		let events=JSON.parse(fs.readFileSync("/mnt/events.json"))
		if(checkmodule.usercheck(body.username,body.token)){
			if(users[body.username].batiments[body.batiment]!==undefined){
				switch(body.batiment){
					case "generateur":
						if(
						users[body.username].ressources.energie>=(10**(users[body.username].batiments.generateur/20)*100)
						){
							event_amel={
								"username":body.username,
								"time":new Date().getTime()+(Math.log2(users[body.username].batiments.generateur+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"generateur",
							};
							users[body.username].ressources.energie-=(10**(users[body.username].batiments.generateur/20)*100);
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "producteur":
						if(
						users[body.username].ressources.carbone>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.oxygene>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.azote>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.iode>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.brome>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.hydrogene>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.soufre>=10**(users[body.username].batiments.producteur/20)*10||
						users[body.username].ressources.chlore>=10**(users[body.username].batiments.producteur/20)*10
						){
							event_amel={
								"username":body.username,
								"time":new Date().getTime()+(Math.log2(users[body.username].batiments.producteur+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"producteur",
							};
							for(a of md.atomes){
								users[body.username].ressources[a]-=10**(users[body.username].batiments.producteur/20)*10;
							}
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "stockage":
						if(
						users[body.username].ressources.energie>=10**(users[body.username].batiments.stockage/15)*100
						||users[body.username].ressources.carbone>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.oxygene>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.azote>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.iode>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.brome>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.hydrogene>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.soufre>=10**(users[body.username].batiments.stockage/15)*10
						||users[body.username].ressources.chlore>=10**(users[body.username].batiments.stockage/15)*10
						){
							event_amel={
								"username":body.username,
								"time":new Date().getTime()+(Math.log2(users[body.username].batiments.stockage+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"stockage",
							};
							users[body.username].ressources.energie-=10**(users[body.username].batiments.stockage/15)*100;
							for(a of md.atomes){
								users[body.username].ressources[a]-=10**(users[body.username].batiments.stockage/15)*10;
							}
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "protecteur":
						if(users[body.username].batiments.protecteur<100){
							///WorkInProgress
						}else{
							res.writeHead(403,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					default:
						if(users[body.username].batiments[body.batiment]<100){
							if(users[body.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]>=(users[body.username].batiments[body.batiment]+1)**3){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.sqrt(users[body.username].batiments[body.batiment]+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"stockage",
								};
								users[body.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]-=(users[body.username].batiments[body.batiment]+1)**3;
								events.push(event_amel);
							}
						}else{
							res.writeHead(403,{'Content-Type':'application/json'});
							res.end();
						}
						break;
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"no batiment named '"+body.batiment+"'\"");
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
