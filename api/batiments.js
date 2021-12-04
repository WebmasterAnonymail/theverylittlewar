const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'batiments',
	POST:(req,res,body)=>{
		let users=checkmodule.usercheck(body.username,body.token);
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
		if(users){
			let user=users[body.username];
			if(user.batiments[body.batiment]!==undefined){
				if(user.batiment_en_amelioration.indexOf(body.batiment)<0){
					switch(body.batiment){
						case "generateur":
							if(
							user.ressources.energie>=(10**(user.batiments.generateur/15)*100)
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(user.batiments.generateur+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"generateur",
								};
								user.batiment_en_amelioration.push("generateur");
								user.ressources.energie-=(10**(user.batiments.generateur/15)*100);
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							
							break;
						case "producteur":
							if(
							user.ressources.carbone>=10**(user.batiments.producteur/15)*10&&
							user.ressources.oxygene>=10**(user.batiments.producteur/15)*10&&
							user.ressources.azote>=10**(user.batiments.producteur/15)*10&&
							user.ressources.iode>=10**(user.batiments.producteur/15)*10&&
							user.ressources.brome>=10**(user.batiments.producteur/15)*10&&
							user.ressources.hydrogene>=10**(user.batiments.producteur/15)*10&&
							user.ressources.soufre>=10**(user.batiments.producteur/15)*10&&
							user.ressources.chlore>=10**(user.batiments.producteur/15)*10
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(user.batiments.producteur+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"producteur",
								};
								user.batiment_en_amelioration.push("producteur");
								for(a of md.atomes){
									user.ressources[a]-=10**(user.batiments.producteur/15)*10;
								}
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						case "stockage":
							if(
							user.ressources.energie>=10**(user.batiments.stockage/15)*100
							&&user.ressources.carbone>=10**(user.batiments.stockage/15)*10
							&&user.ressources.oxygene>=10**(user.batiments.stockage/15)*10
							&&user.ressources.azote>=10**(user.batiments.stockage/15)*10
							&&user.ressources.iode>=10**(user.batiments.stockage/15)*10
							&&user.ressources.brome>=10**(user.batiments.stockage/15)*10
							&&user.ressources.hydrogene>=10**(user.batiments.stockage/15)*10
							&&user.ressources.soufre>=10**(user.batiments.stockage/15)*10
							&&user.ressources.chlore>=10**(user.batiments.stockage/15)*10
							){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+(Math.log2(user.batiments.stockage+1)*10*(60*1000)),
									"type":"amelioration",
									"batiment":"stockage",
								};
								user.batiment_en_amelioration.push("stockage");
								user.ressources.energie-=10**(user.batiments.stockage/15)*100;
								for(a of md.atomes){
									user.ressources[a]-=10**(user.batiments.stockage/15)*10;
								}
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(402,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						case "protecteur":
							if(user.batiments.protecteur<100){
								event_amel={
									"username":body.username,
									"time":new Date().getTime()+Math.sin(Math.PI*(user.batiments.protecteur+1)/200)*5*(60*60*1000),
									"type":"amelioration",
									"batiment":"protecteur",
								};
								user.batiment_en_amelioration.push("protecteur");
								events.push(event_amel);
								res.writeHead(200,{'Content-Type':'application/json'});
								res.end();
							}else{
								res.writeHead(403,{'Content-Type':'application/json'});
								res.end();
							}
							break;
						default:
							if(user.batiments[body.batiment]<100){
								if(user.ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]>=(user.batiments[body.batiment]+1)**3){
									event_amel={
										"username":body.username,
										"time":new Date().getTime()+(Math.sqrt(user.batiments[body.batiment]+1)*10*(60*1000)),
										"type":"amelioration",
										"batiment":body.batiment,
									};
									user.batiment_en_amelioration.push(body.batiment);
									user.ressources[md.atomes[md.batiment_augmentateurs.indexOf(body.batiment)]]-=(user.batiments[body.batiment]+1)**3;
									events.push(event_amel);
									res.writeHead(200,{'Content-Type':'application/json'});
									res.end();
								}else{
									res.writeHead(402,{'Content-Type':'application/json'});
									res.end();
								}
							}else{
								res.writeHead(403,{'Content-Type':'application/json'});
								res.end();
							}
							break;
					}
				}else{
					res.writeHead(409,{'Content-Type':'application/json'});
					res.write("{error:\"batiment already in amelioration\"");
					res.end();
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"no batiment named '"+body.batiment+"'\"");
				res.end();
			}
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(events));
	},
	PATCH:(req,res,body)=>{
		let users=checkmodule.usercheck(body.username,body.token);
		if(users){
			let user=users[body.username];
			let check=true;
			for(let a of ["production","pillage","destruction"]){
				if(body[a] instanceof Array){
					if(a=="destruction"){
						if(body[a].length!=3){
							check=false;
						}else{
							let sum=0;
							for(let b=0;b<3;b++){
								sum+=body[a][b]
							}
							if(sum>3*4){
								check=false;
							}
						}
					}else{
						if(body[a].length!=8){
							check=false;
						}else{
							let sum=0;
							for(let b=0;b<8;b++){
								sum+=body[a][b]
							}
							if(sum>8*4){
								check=false;
							}
						}
					}
				}else{
					check=false;
				}
			}
			if(check){
				user.QG={
					"production":body.production,
					"pillage":body.pillage,
					"destruction":body.destruction
				};
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"Not valid input\"}");
				res.end();
			}
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
	}
}
