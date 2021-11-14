//var bodydServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'users',
	GET:(req,res,body)=>{
		let data=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
		switch(body.mode){
			case "detailed":
				if(checkmodule.usercheck(body.username,body.token)){
						res.writeHead(200,{'Content-Type':'application/json'});
						data=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
						res.write(JSON.stringify(data[body.username]));
						res.end();
				}else{
					res.writeHead(401);
					res.write("Not connected");
					res.end();
				}
				break;
			case "list":
				let response=[];
				for(let a in data){
					response.push(a);
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify(response));
				res.end();
				break;
			case "one":
				if(data[body.user]){
					let response={
						"points":data[body.user].points,
						"positionX":data[body.user].positionX,
						"positionY":data[body.user].positionY,
						"alliance":data[body.user].alliance,
						"description":data[body.user].description,
						"victoires":data[body.user].ressources.victoires,
						"permission":data[body.user].permission,
						"actif":data[body.user].actif,
						"lastUserCheck":data[body.user].lastUserCheck
					}
					res.writeHead(200,{'Content-Type':'application/json'});
					res.write(JSON.stringify(response));
					res.end();
				}else{
					res.writeHead(404);
					res.write("User not found");
					res.end();
				}
				break;
			case "events":
				if(checkmodule.usercheck(body.username,body.token)){
					let response=[];
					for(let event of events){
						switch(event.type){
							case "amelioration":
								if(event.username==body.username){
									response.push({
										"time":event.time,
										"type":"amelioration",
										"batiment":event.batiment
									});
								}
								break;
							case "molecule":
								if(event.username==body.username){
									response.push({
										"time":event.time,
										"type":"molecule",
										"number":event.rest_mols,
										"molecule":event.molecule,
									});
								}
								break;
							case "combat":
								if(event.def==body.username||event.atk==body.username){
									response.push({
										"time":event.time,
										"def":event.def,
										"atk":event.atk,
										"type":"combat"
									});
								}
								break;
							case "return":
								if(event.username==body.username){
									response.push({
										"time":event.time,
										"type":"return"
									});
								}
								break;
						}
					}
					res.writeHead(200,{'Content-Type':'application/json'});
					res.write(JSON.stringify(response));
					res.end();
				}else{
					res.writeHead(401);
					res.write("Not connected");
					res.end();
				}
				break;
		}
	},
	PUT:(req,res,body)=>{
		let data=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		if(body.username&&body.password){
			if(data[body.username]){
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Already used\"}");
				res.end();
			}else{
				data[body.username]={
					"password":body.password,
					"ressources":{
						"energie":500,
						"carbone":50,
						"oxygene":50,
						"azote":50,
						"iode":50,
						"brome":50,
						"hydrogene":50,
						"soufre":50,
						"chlore":50,
						"victoires":0,
					},
					"batiments":{
						"generateur":0,
						"producteur":0,
						"stockage":0,
						"forteresse":0,
						"ionisateur":0,
						"lieur":0,
						"stabilisateur":0,
						"champdeforce":0,
						"usinedexplosif":0,
						"condenseur":0,
						"booster":0,
						"protecteur":0
					},
					"batiment_en_amelioration":[],
					"QG":{
						"production":[4,4,4,4,4,4,4,4],
						"pillage":[4,4,4,4,4,4,4,4],
						"destruction":[4,4,4]
					},
					"points":{
						"batiments":0,
						"defense":0,
						"attaque":0,
						"molecules_crees":0,
						"pertes_temps":0,
						"pertes_combat":0,
						"destruction":0,
						"pillage":0,
						"combats":0,
						"total":0
					},
					"PV_batiments":{
						"generateur":0,
						"producteur":0,
						"stockage":0,
						"protecteur":0
					},
					"molecules":[null,null,null,null,null],
					"molecules_en_utilisation":[0,0,0,0,0],
					"medailles":{
						"def":-1,
						"atk":-1,
						"mol":-1,
						"tps":-1,
						"prt":-1,
						"des":-1,
						"pil":-1,
						"cmb":-1
					},
					"invitations":[],
					"raports":[],
					"positionX":null,
					"positionY":null,
					"messagesPerso":[],
					"alliance":null,
					"description":null,
					"permission":[],
					"actif":false,
					"lastUserCheck":Date.now()
				};
				res.writeHead(204);
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Aucun nom d'utilisateur ou aucun mot de passe");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(data));
	},
	PATCH:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			switch(body.action){
				case "add_invit":
					if(users[body.target]){
						let invite_team=users[body.username].alliance;
						if(teams[invite_team]){
							if(users[body.target].invitations.indexOf(invite_team)<0){
								if(md.has_team_permission(body.username,"inviter")){
									users[body.target].invitations.push(invite_team);
									res.writeHead(200);
									res.end();
								}else{
									res.writeHead(403);
									res.write("Forbidden");
									res.end();
								}
							}else{
								res.writeHead(409);
								res.write("Already invited");
								res.end();
							}
						}else{
							res.writeHead(400);
							res.write("You have no team");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("Target user not exist");
						res.end();
					}
					break;
				case "expel_user":
					if(users[body.target]){
						if(teams[users[body.username].alliance]){
							if(teams[users[body.username].alliance].membres.indexOf(body.target)<0){
								res.writeHead(404);
								res.write("Target user not in team");
								res.end();
							}else{
								if(body.target!=teams[users[body.username].alliance].chef){
									if(md.has_team_permission(body.username,"expulser")){
										teams[users[body.username].alliance].membres.splice(teams[users[body.username].alliance].membres.indexOf(body.target),1);
										users[body.target].alliance=null;
										res.writeHead(200);
										res.end();
									}else{
										res.writeHead(403);
										res.write("Forbidden");
										res.end();
									}
								}else{
									res.writeHead(403);
									res.write("You can't expel the chief");
									res.end();
								}
							}
						}else{
							res.writeHead(400);
							res.write("You have no team");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("Target user not exist");
						res.end();
					}
					break;
				case "transfer_team":
					if(users[body.target]){
						if(teams[users[body.username].alliance]){
							if(teams[users[body.username].alliance].membres.indexOf(body.target)<0){
								res.writeHead(404);
								res.write("Target user not in team");
								res.end();
							}else{
								if(body.username==teams[users[body.username].alliance].chef){
									teams[users[body.username].alliance].chef=body.target;
									res.writeHead(200);
									res.end();
								}else{
									res.writeHead(403);
									res.write("You are not the chief");
									res.end();
								}
							}
						}else{
							res.writeHead(400);
							res.write("You have no team");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("Target user not exist");
						res.end();
					}
					break;
				case "accept_invit":
					if(users[body.username].invitations.indexOf(body.invit)<0){
						res.writeHead(404);
						res.write("Invit not exist");
						res.end();
					}else{
						if(teams[body.invit]){
							if(teams[body.invit].membres.length<25){
								users[body.username].alliance=body.invit;
								teams[body.invit].membres.push(body.username);
								users[body.username].invitations.splice(users[body.username].invitations.indexOf(body.invit),1);
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(507);
								res.write("No places in team");
								res.end();
							}
						}else{
							users[body.username].invitations.splice(users[body.username].invitations.indexOf(body.invit),1);
							res.writeHead(410);
							res.write("The team not exist more");
							res.end();
						}
					}
					break;
				case "decline_invit":
					if(users[body.username].invitations.indexOf(body.invit)<0){
						res.writeHead(404);
						res.write("Invit not exist");
						res.end();
					}else{
						users[body.username].invitations.splice(users[body.username].invitations.indexOf(body.invit),1);
						res.writeHead(200);
						res.end();
					}
					break;
				case "leave_team":
					if(teams[users[body.username].alliance]){
						if(teams[users[body.username].alliance].chef==body.username){
							res.writeHead(403);
							res.write("You are the chief");
							res.end();
						}else{
							for(let a in teams[users[body.username].alliance].grades){
								if(teams[users[body.username].alliance].grades[a].posseseur==body.username){
									delete teams[users[body.username].alliance].grades[a];
								}
							}
							teams[users[body.username].alliance].membres.splice(teams[users[body.username].alliance].membres.indexOf(body.username),1);
							users[body.username].alliance=null;
							res.writeHead(200);
							res.end();
						}
					}else{
						res.writeHead(400);
						res.write("You have no team");
						res.end();
					}
					break;
				case "delete_report":
					let retranche=0;
					for(let a of body.reports){
						users[body.username].raports.splice(a-retranche,1);
						retranche++;
					}
					res.writeHead(200);
					res.end();
					break;
				case "read_report":
					users[body.username].raports[body.report].readed=true;
					res.writeHead(200);
					res.end();
					break;
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	DELETE:(req,res,body)=>{
		let data=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"))
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(data));
	}
}
