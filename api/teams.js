const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'teams',
	GET:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		switch(body.mode){
			case "detailed":
				if(checkmodule.usercheck(body.username,body.token)){
					if(users[body.username].alliance){
						let data=teams[users[body.username].alliance];
						if(data){
							res.writeHead(200,{'Content-Type':'application/json'});
							res.write(JSON.stringify(data));
							res.end();
						}else{
							users.alliance=null;
							res.writeHead(410);
							res.write("Team not exist more");
							res.end();
							fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
						}
					}else{
						res.writeHead(404);
						res.write("No teams");
						res.end();
					}
				}else{
					res.writeHead(401);
					res.write("Not connected");
					res.end();
				}
				break;
			case "list":
				let response=[];
				for(let a in teams){
					if(a!="NONETEAM"){
						response.push(a);
					}
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify(response));
				res.end();
				break;
			case "one":
				let sum=0;
				let nb_membres=0;
				if(teams[body.team]){
					for(let a of teams[body.team].membres){
						if(users[a].actif){
							sum+=users[a].points.total;
							nb_membres++;
						}
					}
					let response={
						"membres":teams[body.team].membres,
						"chef":teams[body.team].chef,
						"grades":teams[body.team].grades,
						"description":teams[body.team].description,
						"diplomatie":teams[body.team].diplomatie,
						"victoires":teams[body.team].ressources.victoires,
						"color":teams[body.team].color,
						"somme":sum,
						"moyenne":sum/nb_membres
					}
					res.writeHead(200,{'Content-Type':'application/json'});
					res.write(JSON.stringify(response));
					res.end();
				}else{
					res.writeHead(404);
					res.write("Team not found");
					res.end();
				}
				break;
		}
	},
	PUT:(req,res,body)=>{
		let users=checkmodule.usercheck(body.username,body.token);
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(users){
			let user=users[body.username];
			if(body.name_team){
				if(teams[body.name_team]){
					res.writeHead(409);
					res.write("Already used");
					res.end();
				}else{
					if(user.ressources.energie>=100000){
						teams[body.name_team]={
							"membres":[body.username],
							"chef":body.username,
							"grades":{},
							"ressources":{
								"energie":0,
								"carbone":0,
								"oxygene":0,
								"azote":0,
								"iode":0,
								"brome":0,
								"hydrogene":0,
								"soufre":0,
								"chlore":0,
								"victoires":0,
							},
							"description":null,
							"diplomatie":{
								"pactes":[],
								"guerres":[]
							},
							"requetes_ressources":[],
							"color":"#c0c0c0"
						}
						user.alliance=body.name_team;
						user.ressources.energie-=100000;
						res.writeHead(204);
						res.end();
					}else{
						res.writeHead(402);
						res.write("Not enough energy");
						res.end();
					}
				}
			}else{
				res.writeHead(400);
				res.write("Please give an team name");
				res.end();
			}
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	PATCH:(req,res,body)=>{
		let users=checkmodule.usercheck(body.username,body.token);
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(users){
			let user=users[body.username];
			if(teams[user.alliance]){
				switch(body.action){
					case "change_description":
						if(md.has_team_permission(body.username,"description")){
							teams[user.alliance].description=body.description;
							res.writeHead(200);
							res.end();
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "change_color":
						if(md.has_team_permission(body.username,"description")){
							hexacolor=/^#[0-9a-fA-F]{6}$/;
							if(hexacolor.test(body.color)){
								teams[user.alliance].color=body.color;
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(400);
								res.write("Not a color");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "add_grade":
						if(md.has_team_permission(body.username,"grades")){
							if(body.grade){
								if(teams[user.alliance].membres.indexOf(body.posseseur)<0){
									res.writeHead(404);
									res.write("User is not in team");
									res.end();
								}else{
									if(teams[user.alliance].grades[body.grade]){
										res.writeHead(409);
										res.write("Grade already exist");
										res.end();
									}else{
										teams[user.alliance].grades[body.grade]={
											"posseseur":body.posseseur,
											"guerre":body.guerre,
											"pacte":body.pacte,
											"finance":body.finance,
											"grades":body.grades,
											"inviter":body.inviter,
											"expulser":body.expulser,
											"description":body.description,
										}
										res.writeHead(200);
										res.end();
									}
								}
							}else{
								res.writeHead(400);
								res.write("Please write the grade name");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "delete_grade":
						if(md.has_team_permission(body.username,"grades")){
							if(teams[user.alliance].grades[body.grade]){
								delete teams[user.alliance].grades[body.grade]
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(409);
								res.write("Grade not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
				}
			}else{
				res.writeHead(400);
				res.write("You have no team");
				res.end();
			}
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	POST:(req,res,body)=>{
		let users=checkmodule.usercheck(body.username,body.token)
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(users){
			let user=users[body.username];
			if(teams[user.alliance]){
				switch(body.action){
					case "give":
						let OK=true;
						for(let a of md.ressources){
							if(typeof(body[a])=="number"){
								if(body[a]<0){
									OK=false;
								}
							}else{
								if(body[a]==null){
									body[a]=0;
								}else{
									OK=false;
								}
							}
						}
						if(OK){
							for(let b of md.ressources){
								if(body[b]>user.ressources[b]){
									OK=false;
								}
							}
							if(OK){
								for(let c of md.ressources){
									user.ressources[c]-=body[c];
									teams[user.alliance].ressources[c]+=body[c];
									res.writeHead(200);
									res.end();
								}
							}else{
								res.writeHead(402);
								res.write("No enough ressources");
								res.end();
							}
						}else{
							res.writeHead(400);
							res.write("Bad values");
							res.end();
						}
						break;
					case "ask_donnation":
						let OK1=true;
						for(let a of md.ressources){
							if(typeof(body[a])=="number"){
								if(body[a]<0){
									OK1=false;
								}
							}else{
								if(body[a]==null){
									body[a]=0;
								}else{
									OK1=false;
								}
							}
						}
						if(OK1){
							let at_push={"who":body.username};
							for(let b of md.ressources){
								at_push[b]=body[b];
							}
							teams[user.alliance].requetes_ressources.push(at_push);
							res.writeHead(200);
							res.end();
						}else{
							res.writeHead(400);
							res.write("Bad values");
							res.end();
						}
						break;
					case "accept_donnation":
						if(md.has_team_permission(body.username,"finance")){
							if(body.donnation_id<teams[user.alliance].requetes_ressources.length){
								let OK2=true;
								for(let a of md.ressources){
									if(teams[user.alliance].requetes_ressources[body.donnation_id][a]>teams[user.alliance].ressources[a]){
										OK2=false;
									}
								}
								if(OK2){
									if(teams[user.alliance].membres.indexOf(teams[user.alliance].requetes_ressources[body.donnation_id].who)<0){
										res.writeHead(410);
										res.write("User left the team");
										res.end();
									}else{
										for(let b of md.ressources){
											users[teams[user.alliance].requetes_ressources[body.donnation_id].who].ressources[b]+=teams[user.alliance].requetes_ressources[body.donnation_id][b];
											teams[user.alliance].ressources[b]-=teams[user.alliance].requetes_ressources[body.donnation_id][b];
										}
										teams[user.alliance].requetes_ressources.splice(body.donnation_id,1);
										res.writeHead(200);
										res.end();
									}
								}else{
									res.writeHead(402);
									res.write("No enough ressources");
									res.end();
								}
							}else{
								res.writeHead(404);
								res.write("Donnastion ask not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "reject_donnation":
						if(md.has_team_permission(body.username,"finance")){
							if(body.donnation_id<teams[user.alliance].requetes_ressources){
								teams[user.alliance].requetes_ressources.splice(body.donnation_id,1);
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(404);
								res.write("Donnation ask not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "new_pacte":
						if(md.has_team_permission(body.username,"pacte")){
							if(teams[body.pacte]){
								if(teams[user.alliance].diplomatie.pactes.indexOf(body.pacte)<0){
									teams[user.alliance].diplomatie.pactes.push(body.pacte);
									res.writeHead(200);
									res.end();
								}else{
									res.writeHead(409);
									res.write("Pact already exist");
									res.end();
								}
							}else{
								res.writeHead(404);
								res.write("Team not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "delete_pacte":
						if(md.has_team_permission(body.username,"pacte")){
							if(teams[user.alliance].diplomatie.pactes.indexOf(body.pacte)<0){
								res.writeHead(404);
								res.write("Pact not exist");
								res.end();
							}else{
								teams[user.alliance].diplomatie.pactes.splice(teams[user.alliance].diplomatie.pactes.indexOf(body.pacte),1);
								res.writeHead(200);
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "new_guerre":
						if(md.has_team_permission(body.username,"guerre")){
							if(teams[body.guerre]){
								if(teams[user.alliance].diplomatie.guerres.indexOf(body.guerre)<0){
									teams[user.alliance].diplomatie.guerres.push(body.guerre);
									res.writeHead(200);
									res.end();
								}else{
									res.writeHead(409);
									res.write("War already exist");
									res.end();
								}
							}else{
								res.writeHead(404);
								res.write("Team not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "delete_guerre":
						if(md.has_team_permission(body.username,"guerre")){
							if(teams[user.alliance].diplomatie.guerres.indexOf(body.guerre)<0){
								res.writeHead(404);
								res.write("War not exist");
								res.end();
							}else{
								teams[user.alliance].diplomatie.guerres.splice(teams[user.alliance].diplomatie.guerres.indexOf(body.guerre),1);
								res.writeHead(200);
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "transfer":
						if(md.has_team_permission(body.username,"finance")){
							let OK3=true;
							for(let a of md.ressources){
								if(body[a]>teams[user.alliance].ressources[a]){
									OK3=false;
								}
							}
							if(OK3){
								if(teams[body.target]){
									if(teams[user.alliance].diplomatie.pactes.indexOf(body.target)<0){
										res.writeHead(409);
										res.write("You need to have a pact with the team");
										res.end();
									}else{
										for(let b of md.ressources){
											teams[body.target].ressources[b]+=body[b];
											teams[user.alliance].ressources[b]-=body[b];
										}
										res.writeHead(200);
										res.end();
									}
								}else{
									res.writeHead(404);
									res.write("Team not exist");
									res.end();
								}
							}else{
								res.writeHead(402);
								res.write("No enough ressources");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
				}
			}else{
				res.writeHead(400);
				res.write("You have no team");
				res.end();
			}
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	}
}
