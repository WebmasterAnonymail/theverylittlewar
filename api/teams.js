const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
function calc_max_earning_team_war(winer,loser){
	let win_pts=0
	for(let a of winer.membres){
		if(dbs.users[a].actif){
			checkmodule.usercheck(a)
			win_pts+=dbs.users[a].points.total;
		}
	}
	let los_pts=0
	for(let a of loser.membres){
		if(dbs.users[a].actif){
			checkmodule.usercheck(a)
			los_pts+=dbs.users[a].points.total;
		}
	}
	const max_transfer_rate=0.2; //taux de transfert lorsque l'équipe perdante a une infinité de points de plus que le gagnant
	//A savoir : en cas d'égalité des points, rate=max_transfer_rate/2
	const semi_transfer_value=1000; //nombre de point d'écart nécaissaires pour obtenir un taux 50% suppérieur ou inférieur a celui d'égalité
	let rate=max_transfer_rate/(1+Math.exp((win_pts-los_pts)*Math.log(3)/semi_transfer_value))//lorsque los a + pts que win, la f(x) croit
	return rate*los_pts
}
module.exports = {
	name:'teams',
	GET:(req,res,body)=>{
		switch(body.mode){
			case "detailed":
				if(checkmodule.usercheck(body.username,body.token)){
					if(dbs.users[body.username].alliance){
						let data=dbs.teams[dbs.users[body.username].alliance];
						if(data){
							res.writeHead(200,{'Content-Type':'application/json'});
							res.write(JSON.stringify(data));
							res.end();
						}else{
							dbs.users.alliance=null;
							res.writeHead(410);
							res.write("Team not exist more");
							res.end();
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
				for(let a in dbs.teams){
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
				if(body.team in dbs.teams){
					for(let a of dbs.teams[body.team].membres){
						if(dbs.users[a].actif){
							sum+=dbs.users[a].points.total;
							nb_membres++;
						}
					}
					let response={
						"membres":dbs.teams[body.team].membres,
						"chef":dbs.teams[body.team].chef,
						"grades":dbs.teams[body.team].grades,
						"description":dbs.teams[body.team].description,
						"victoires":dbs.teams[body.team].ressources.victoires,
						"color":dbs.teams[body.team].color,
						"somme":sum,
						"indemnite":dbs.teams[body.team].diplomatie.point_allowance,
						"moyenne":(sum+dbs.teams[body.team].diplomatie.point_allowance)/nb_membres
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
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(body.name_team){
				if(dbs.teams[body.name_team]){
					res.writeHead(409);
					res.write("Already used");
					res.end();
				}else{
					if(user.ressources.energie>=100000){
						dbs.teams[body.name_team]={
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
								"guerres":[],
								"war_status":{},
								"strategie":[body.username],
								"point_allowance":0
							},
							"pv":50000,
							"pv_max":50000,
							"requetes_ressources":[],
							"color":"#c0c0c0"
						}
						user.alliance=body.name_team;
						user.ressources.energie-=100000;
						res.writeHead(201);
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
	},
	PATCH:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(user.alliance && user.alliance in dbs.teams){
				switch(body.action){
					case "change_description":
						if(md.has_team_permission(body.username,"description")){
							dbs.teams[user.alliance].description=body.description;
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
								dbs.teams[user.alliance].color=body.color;
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
								if(dbs.teams[user.alliance].membres.includes(body.posseseur)){
									if(body.grade in dbs.teams[user.alliance].grades){
										res.writeHead(409);
										res.write("Grade already exist");
										res.end();
									}else{
										dbs.teams[user.alliance].grades[body.grade]={"posseseur":body.posseseur}
										for(let a of md.team_permissions){
											dbs.teams[user.alliance].grades[body.grade][a]=body[a];
										}
										res.writeHead(200);
										res.end();
									}
								}else{
									res.writeHead(404);
									res.write("User is not in team");
									res.end();
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
							if(body.grade in dbs.teams[user.alliance].grades){
								delete dbs.teams[user.alliance].grades[body.grade]
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
					case "change_strategie":
						if(md.has_team_permission(body.username,"grades")){
							let OK1=dbs.teams[user.alliance].membres.length==body.strategie.length;
							for(let a of dbs.teams[user.alliance].membres){
								OK1&&=body.strategie.includes(a);
							}
							if(OK1){
								dbs.teams[user.alliance].diplomatie.strategie=body.strategie;
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(400);
								res.write("Please define a strategie with every players");
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
	},
	POST:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(user.alliance && user.alliance in dbs.teams){
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
									dbs.teams[user.alliance].ressources[c]+=body[c];
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
							dbs.teams[user.alliance].requetes_ressources.push(at_push);
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
							if(body.donnation_id<dbs.teams[user.alliance].requetes_ressources.length){
								let OK2=true;
								for(let a of md.ressources){
									if(dbs.teams[user.alliance].requetes_ressources[body.donnation_id][a]>dbs.teams[user.alliance].ressources[a]){
										OK2=false;
									}
								}
								if(OK2){
									if(dbs.teams[user.alliance].membres.includes(dbs.teams[user.alliance].requetes_ressources[body.donnation_id].who)){
										for(let b of md.ressources){
											dbs.users[dbs.teams[user.alliance].requetes_ressources[body.donnation_id].who].ressources[b]+=dbs.teams[user.alliance].requetes_ressources[body.donnation_id][b];
											dbs.teams[user.alliance].ressources[b]-=dbs.teams[user.alliance].requetes_ressources[body.donnation_id][b];
										}
										dbs.teams[user.alliance].requetes_ressources.splice(body.donnation_id,1);
										res.writeHead(200);
										res.end();
									}else{
										res.writeHead(410);
										res.write("User left the team");
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
							if(body.donnation_id<dbs.teams[user.alliance].requetes_ressources){
								dbs.teams[user.alliance].requetes_ressources.splice(body.donnation_id,1);
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
							if(body.pacte && body.pacte in dbs.teams){
								if(!dbs.teams[user.alliance].diplomatie.pactes.includes(body.pacte)){
									dbs.teams[user.alliance].diplomatie.pactes.push(body.pacte);
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
							if(dbs.teams[user.alliance].diplomatie.pactes.includes(body.pacte)){
								dbs.teams[user.alliance].diplomatie.pactes.splice(dbs.teams[user.alliance].diplomatie.pactes.indexOf(body.pacte),1);
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(404);
								res.write("Pact not exist");
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
							if(body.guerre && body.guerre in dbs.teams){
								if(!dbs.teams[user.alliance].diplomatie.guerres.includes(body.guerre)){
									if(body.guerre in dbs.teams[user.alliance].diplomatie.war_status){
										let team_war_status=dbs.teams[user.alliance].diplomatie.war_status[body.guerre];
										let target_war_status=dbs.teams[body.guerre].diplomatie.war_status[user.alliance];
										let role="offended";
										if(team_war_status.assailant){
											role="offender";
										}
										if(dbs.teams[user.alliance].diplomatie.war_status[body.guerre].revenged){
											//Cas où lors d'une revenche, on arrete un cesser-le-feu (ou bien on tente de la reredéclarer)
											if(team_war_status.revenge.ended){
												res.writeHead(406);
												res.write("War already revenged");
												res.end();
											}else if(team_war_status.revenge[role+"_defeated"]){
												res.writeHead(406);
												res.write("Team defeated");
												res.end();
											}else{
												dbs.teams[user.alliance].diplomatie.guerres.push(body.guerre);
												team_war_status.revenge[role+"_in_ceasefire"]=false;
												target_war_status.revenge[role+"_in_ceasefire"]=false;
												res.writeHead(200);
												res.end();
											}
										}else{
											if(team_war_status.offensive.ended){
												//Cas où l'on tente de redéclarer la guerre
												if(team_war_status.offensive.end_modality.won&&team_war_status.assailant){///TMP
													res.writeHead(406);
													res.write("War already won");
													res.end();
												}else{
													//Cas de revenche
													team_war_status.revenged=true;
													team_war_status.revenge={
														"begin":Date.now(),
														"offended_in_ceasefire":true,
														"offender_in_ceasefire":true,
														"peace_treatys_proposed":[],
														"ended":false,
														"offended_defeated":false,
														"offender_defeated":false,
														"first_defeat":null,
														"end_modality":null,
													}
													target_war_status.revenged=true;
													target_war_status.revenge={
														"begin":Date.now(),
														"offended_in_ceasefire":true,
														"offender_in_ceasefire":true,
														"peace_treatys_proposed":[],
														"ended":false,
														"offended_defeated":false,
														"offender_defeated":false,
														"first_defeat":null,
														"end_modality":null,
													}
													//Déclaration de la guerre
													dbs.teams[user.alliance].diplomatie.guerres.push(body.guerre);
													team_war_status.revenge[role+"_in_ceasefire"]=false;
													target_war_status.revenge[role+"_in_ceasefire"]=false;
													res.writeHead(200);
													res.end();
												}
											}else if(team_war_status.offensive[role+"_defeated"]){
												res.writeHead(406);
												res.write("Team defeated");
												res.end();
											}else{
												//Cas où lors d'une attaque, on arrete un cesser-le-feu
												dbs.teams[user.alliance].diplomatie.guerres.push(body.guerre);
												team_war_status.offensive[role+"_in_ceasefire"]=false;
												target_war_status.offensive[role+"_in_ceasefire"]=false;
												res.writeHead(200);
												res.end();
											}
										}
									}else{
										//Cas où l'on déclare la guerre pour la première fois de la partie
										dbs.teams[user.alliance].diplomatie.guerres.push(body.guerre);
										dbs.teams[user.alliance].diplomatie.war_status[body.guerre]={
											"assailant":true,
											"revenged":false,
											"offensive":{
												"begin":Date.now(),
												"offended_in_ceasefire":true,
												"offender_in_ceasefire":false,
												"peace_treatys_proposed":[],
												"ended":false,
												"offended_defeated":false,
												"offender_defeated":false,
												"first_defeat":null,
												"end_modality":null
											},
											"revenge":null
										}
										dbs.teams[body.guerre].diplomatie.war_status[user.alliance]={
											"assailant":false,
											"revenged":false,
											"offensive":{
												"begin":Date.now(),
												"offended_in_ceasefire":true,
												"offender_in_ceasefire":false,
												"peace_treatys_proposed":[],
												"ended":false,
												"offended_defeated":false,
												"offender_defeated":false,
												"first_defeat":null,
												"end_modality":null
											},
											"revenge":null
										}
										res.writeHead(200);
										res.end();
									}
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
							if(dbs.teams[user.alliance].diplomatie.guerres.includes(body.guerre)){
								let team_war_status=dbs.teams[user.alliance].diplomatie.war_status[body.guerre];
								let target_war_status=dbs.teams[body.guerre].diplomatie.war_status[user.alliance];
								let role="offended";
								if(team_war_status.assailant){
									role="offender";
								}
								if(team_war_status.revenged){
									team_war_status.revenge[role+"_in_ceasefire"]=true;
									target_war_status.revenge[role+"_in_ceasefire"]=true;
								}else{
									team_war_status.offensive[role+"_in_ceasefire"]=true;
									target_war_status.offensive[role+"_in_ceasefire"]=true;
								}
								dbs.teams[user.alliance].diplomatie.guerres.splice(dbs.teams[user.alliance].diplomatie.guerres.indexOf(body.guerre),1);
								res.writeHead(200);
								res.end();
							}else{
								res.writeHead(404);
								res.write("War not exist");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
						break;
					case "create_treaty":
						if(md.has_team_permission(body.username,"diplomatie")){
							if(body.target && body.target in dbs.teams){
								if(body.target in dbs.teams[user.alliance].diplomatie.war_status){
									let team_war_status=dbs.teams[user.alliance].diplomatie.war_status[body.target];
									let target_war_status=dbs.teams[body.target].diplomatie.war_status[user.alliance];
									let role="offended";
									let unrole="offender";
									if(team_war_status.assailant){
										role="offender";
										unrole="offended";
									}
									let offensive_team=team_war_status.offensive;
									let offensive_target=target_war_status.offensive;
									if(team_war_status.revenged){
										offensive_team=team_war_status.revenge;
										offensive_target=target_war_status.revenge;
									}
									if(!offensive_team.ended){
										let OK=true;
										let team_treaty={"won":false};
										let target_treaty={"won":true};
										let winteam=body.target;
										let loseteam=user.alliance;
										switch(body.type){
											case "win":
												team_treaty={"won":true};
												target_treaty={"won":false};
												winteam=user.alliance;
												loseteam=body.target;
											case "lose":
												let indemnites=Number(body.indemnity);
												if(Number.isFinite(indemnites)
												&&indemnites>=0
												&&indemnites<=calc_max_earning_team_war(dbs.teams[winteam],dbs.teams[loseteam])){
													team_treaty.indemnites=indemnites;
													target_treaty.indemnites=indemnites;
												}else{
													OK=false;
													res.writeHead(406);
													res.write("You cannot fix indemnities as high");
													res.end();
												}
												break;
											case "draw":
												team_treaty={"won":null};
												target_treaty={"won":null};
												break;
											default:
												OK=false;
												res.writeHead(400);
												res.write("Treaty type unknown");
												res.end();
										}
										if(OK){
											if(body.impose){
												let winer=offensive_team[unrole+"_defeated"];
												winer&&=!offensive_team[role+"_defeated"];
												winer&&=offensive_team.first_defeat+(2*60*60*1000)<Date.now();
												if(winer){
													offensive_team.end_modality=team_treaty;
													offensive_target.end_modality=target_treaty;
													offensive_team.end_modality.date=Date.now();
													offensive_target.end_modality.date=Date.now();
													offensive_team.ended=true;
													offensive_target.ended=true;
													offensive_team.peace_treatys_proposed=[];
													offensive_target.peace_treatys_proposed=[];
													if(!offensive_team[role+"_in_ceasefire"]){
														dbs.teams[user.alliance].diplomatie.guerres.splice(dbs.teams[user.alliance].diplomatie.guerres.indexOf(body.target),1);
													}
													if(!offensive_team[unrole+"_in_ceasefire"]){ //Ne devrait jamais arriver mais au cas où ...
														dbs.teams[body.target].diplomatie.guerres.splice(dbs.teams[body.target].diplomatie.guerres.indexOf(user.alliance),1);
													}
													offensive_team[role+"_in_ceasefire"]=true;
													offensive_team[unrole+"_in_ceasefire"]=true;
													offensive_target[role+"_in_ceasefire"]=true;
													offensive_target[unrole+"_in_ceasefire"]=true;
													res.writeHead(200);
													res.end();
												}else{
													res.writeHead(406);
													res.write("You cannot impose treaty if you don't defeat your target since 2 hours");
													res.end();
												}
											}else{
												offensive_target.peace_treatys_proposed.push(target_treaty);
												res.writeHead(200);
												res.end();
											}
										}
									}else{
										res.writeHead(409);
										res.write("You have to be in war with this team");
										res.end();
									}
								}else{
									res.writeHead(409);
									res.write("You have to be in war with this team");
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
					case "accept_treaty":
						break;
					case "reject_treaty":
						if(md.has_team_permission(body.username,"diplomatie")){
							if(body.treaty_team && body.treaty_team in dbs.teams[user.alliance].diplomatie.war_status){
								let offensive=dbs.teams[user.alliance].diplomatie.war_status[body.treaty_team].offensive;
								if(dbs.teams[user.alliance].diplomatie.war_status[body.treaty_team].revenged){
									offensive=dbs.teams[user.alliance].diplomatie.war_status[body.treaty_team].revenge;
								}
								console.log(offensive)
								if(body.treaty_id in offensive.peace_treatys_proposed){
									offensive.peace_treatys_proposed.splice(body.treaty_id,1);
									res.writeHead(200);
									res.end();
								}else{
									res.writeHead(404);
									res.write("Treaty not exist");
									res.end();
								}
							}else{
								res.writeHead(404);
								res.write("Treaty not exist");
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
								if(body[a]>dbs.teams[user.alliance].ressources[a]){
									OK3=false;
								}
							}
							if(OK3){
								if(body.target && body.target in dbs.teams){
									if(dbs.teams[user.alliance].diplomatie.pactes.includes(body.target)){
										for(let b of md.ressources){
											dbs.teams[body.target].ressources[b]+=body[b];
											dbs.teams[user.alliance].ressources[b]-=body[b];
										}
										res.writeHead(200);
										res.end();
									}else{
										res.writeHead(409);
										res.write("You need to have a pact with the team");
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
					case "add_max_pvs":
						let PV_to_add=Number(body.pvs);
						if(Number.isFinite(PV_to_add)&&PV_to_add>0){
							if(user.ressources.energie<2*PV_to_add){
								res.writeHead(402);
								res.write("Not enough ressources");
								res.end();
							}else{
								user.ressources.energie-=2*PV_to_add;
								dbs.teams[user.alliance].pv_max+=PV_to_add;
								dbs.teams[user.alliance].pv+=PV_to_add;
								res.writeHead(200);
								res.end();
							}
						}else{
							res.writeHead(406);
							res.write("Not a number");
							res.end();
						}
						break;
						case "add_pvs":
							let PV_to_regen=Number(body.pvs);
							if(Number.isFinite(PV_to_regen)&&PV_to_regen>0){
								if(user.ressources.energie<PV_to_regen){
									res.writeHead(402);
									res.write("Not enough ressources");
									res.end();
								}else if(PV_to_regen+dbs.teams[user.alliance].pv>dbs.teams[user.alliance].pv_max){
									res.writeHead(409);
									res.write("Max pvs overloaded");
									res.end();
								}else{
									user.ressources.energie-=PV_to_regen;
									dbs.teams[user.alliance].pv+=PV_to_regen;
									res.writeHead(200);
									res.end();
								}
							}else{
								res.writeHead(406);
								res.write("Not a number");
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
	}
}
