const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'batiments',
	POST:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let events=require("/mnt/events.json");
		let bd=JSON.parse(body);
		if(checkmodule.usercheck(bd.username,bd.token)){
			if(users[bd.username].batiments[bd.batiment]){
				switch(bd.batiment){
					case "generateur":
						if(
						users[bd.username].ressources.energie>=(10**(users[bd.username].batiments.generateur/20)*100)
						){
							event_amel={
								"username":bd.username,
								"time":new Date().getTime()+(Math.log2(users[bd.username].batiments.generateur+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"generateur",
							};
							users[bd.username].ressources.energie-=(10**(users[bd.username].batiments.generateur/20)*100);
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "producteur":
						if(
						users[bd.username].ressources.carbone>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.oxygene>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.azote>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.iode>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.brome>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.hydrogene>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.soufre>=10**(users[bd.username].batiments.producteur/20)*10||
						users[bd.username].ressources.chlore>=10**(users[bd.username].batiments.producteur/20)*10
						){
							event_amel={
								"username":bd.username,
								"time":new Date().getTime()+(Math.log2(users[bd.username].batiments.producteur+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"producteur",
							};
							for(a of md.atomes){
								users[bd.username].ressources[a]-=10**(users[bd.username].batiments.producteur/20)*10;
							}
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "stockage":
						if(
						users[bd.username].ressources.energie>=10**(users[bd.username].batiments.stockage/15)*100
						||users[bd.username].ressources.carbone>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.oxygene>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.azote>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.iode>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.brome>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.hydrogene>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.soufre>=10**(users[bd.username].batiments.stockage/15)*10
						||users[bd.username].ressources.chlore>=10**(users[bd.username].batiments.stockage/15)*10
						){
							event_amel={
								"username":bd.username,
								"time":new Date().getTime()+(Math.log2(users[bd.username].batiments.stockage+1)*10*(60*1000)),
								"type":"amelioration",
								"batiment":"stockage",
							};
							users[bd.username].ressources.energie-=10**(users[bd.username].batiments.stockage/15)*100;
							for(a of md.atomes){
								users[bd.username].ressources[a]-=10**(users[bd.username].batiments.stockage/15)*10;
							}
							events.push(event_amel);
						}else{
							res.writeHead(402,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					case "protecteur":
						if(users[bd.username].batiments.protecteur<100){
							///WorkInProgress
						}else{
							res.writeHead(403,{'Content-Type':'application/json'});
							res.end();
						}
						break;
					default:
						if(users[bd.username].batiments[bd.batiment]<100){
							if(users[bd.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(bd.batiment)]]>=(users[bd.username].batiments[bd.batiment]+1)**3){
								event_amel={
									"username":bd.username,
									"time":new Date().getTime()+(Math.sqrt(users[bd.username].batiments[bd.batiment]+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"stockage",
								};
								users[bd.username].ressources[md.atomes[md.batiment_augmentateurs.indexOf(bd.batiment)]]-=(users[bd.username].batiments[bd.batiment]+1)**3;
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
