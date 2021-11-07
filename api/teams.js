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
					response.push(a);
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify(response));
				res.end();
				break;
			case "one":
				if(data[body.team]){
					let response={
						
					}
				}else{
					res.writeHead(404);
					res.write("Team not found");
					res.end();
				}
				break;
		}
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(body.name_team){
				if(teams[body.name_team]){
					res.writeHead(409);
					res.write("Already used");
					res.end();
				}else{
					if(users[body.username].ressources.energie>=100000){
						teams[body.name_team]={
							membres:[body.username],
							chef:body.username,
							grades:{},
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
							"requetes_ressources":[]
						}
						users[body.username].alliance=body.name_team;
						users[body.username].ressources.energie-=100000;
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
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	PATCH:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(teams[users[body.username].alliance]){
				switch(body.action){
					case "change_description":
						if(md.has_team_permission(body.username,"description")){
							teams[users[body.username].alliance].description=body.description;
							res.writeHead(200);
							res.end();
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "add_grade":
						if(md.has_team_permission(body.username,"grades")){
							if(body.grade){
								if(teams[users[body.username].alliance].membres.indexOf(body.posseseur)<0){
									res.writeHead(404);
									res.write("User is not in team");
									res.end();
								}else{
									if(teams[users[body.username].alliance].grades[body.grade]){
										res.writeHead(409);
										res.write("Grade already exist");
										res.end();
									}else{
										teams[users[body.username].alliance].grades[body.grade]={
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
							if(teams[users[body.username].alliance].grades[body.grade]){
								delete teams[users[body.username].alliance].grades[body.grade]
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
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	POST:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(teams[users[body.username].alliance]){
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
								if(body[b]>users[body.username].ressources[b]){
									OK=false;
								}
							}
							if(OK){
								for(let c of md.ressources){
									users[body.username].ressources[c]-=body[c];
									teams[users[body.username].alliance].ressources[c]+=body[c];
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
							teams[users[body.username].alliance].requetes_ressources.push(at_push);
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
							if(body.donnation_id<teams[users[body.username].alliance].requetes_ressources.length){
								let OK2=true;
								for(let a of md.ressources){
									if(teams[users[body.username].alliance].requetes_ressources[body.donnation_id][a]>teams[users[body.username].alliance].ressources[a]){
										OK2=false;
									}
								}
								if(OK2){
									if(teams[users[body.username].alliance].membres.indexOf(teams[users[body.username].alliance].requetes_ressources[body.donnation_id].who)<0){
										res.writeHead(410);
										res.write("User left the team");
										res.end();
									}else{
										for(let b of md.ressources){
											users[teams[users[body.username].alliance].requetes_ressources[body.donnation_id].who].ressources[b]+=teams[users[body.username].alliance].requetes_ressources[body.donnation_id][b];
											teams[users[body.username].alliance].ressources[b]-=teams[users[body.username].alliance].requetes_ressources[body.donnation_id][b];
										}
										teams[users[body.username].alliance].requetes_ressources.splice(body.donnation_id,1);
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
							if(body.donnation_id<teams[users[body.username].alliance].requetes_ressources){
								teams[users[body.username].alliance].requetes_ressources.splice(body.donnation_id,1);
								res.writeHead(200);
								res.end();
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
					case "new_pacte":
						if(md.has_team_permission(body.username,"pacte")){
							if(teams[body.pacte]){
								if(teams[users[body.username].alliance].diplomatie.pactes.indexOf(body.pacte)<0){
									teams[users[body.username].alliance].diplomatie.pactes.push(body.pacte);
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
							if(teams[users[body.username].alliance].diplomatie.pactes.indexOf(body.pacte)<0){
								res.writeHead(404);
								res.write("Pact not exist");
								res.end();
							}else{
								teams[users[body.username].alliance].diplomatie.pactes.splice(teams[users[body.username].alliance].diplomatie.pactes.indexOf(body.pacte),1);
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
								if(teams[users[body.username].alliance].diplomatie.guerres.indexOf(body.guerre)<0){
									teams[users[body.username].alliance].diplomatie.guerres.push(body.guerre);
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
							if(teams[users[body.username].alliance].diplomatie.guerres.indexOf(body.guerre)<0){
								res.writeHead(404);
								res.write("War not exist");
								res.end();
							}else{
								teams[users[body.username].alliance].diplomatie.guerres.splice(teams[users[body.username].alliance].diplomatie.guerres.indexOf(body.guerre),1);
								res.writeHead(200);
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
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	}
}
