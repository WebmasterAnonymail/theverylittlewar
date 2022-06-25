const md=require("./miscdatas.js")
module.exports={
	eventcheck:function(){
		let a_suprimer=[];
		for(let a in dbs.events){
			if(dbs.events[a].time<Date.now()){
				switch(dbs.events[a].type){
					case "amelioration":
						if(dbs.users[dbs.events[a].username]){
							dbs.users[dbs.events[a].username].batiments[dbs.events[a].batiment]++;
							dbs.users[dbs.events[a].username].points.batiments+=md.points_batiments[dbs.events[a].batiment];
							if(md.batiment_pveurs.indexOf(dbs.events[a].batiment)>=0){
								if(dbs.events[a].batiment=="protecteur"){
									dbs.users[dbs.events[a].username].PV_batiments.protecteur=10**(dbs.users[dbs.events[a].username].batiments.protecteur/20)*10*dbs.users[dbs.events[a].username].batiments.protecteur;
								}else{
									dbs.users[dbs.events[a].username].PV_batiments[dbs.events[a].batiment]=10**(dbs.users[dbs.events[a].username].batiments[dbs.events[a].batiment]/20)*1000;
								}
							}
							dbs.users[dbs.events[a].username].batiment_en_amelioration.splice(dbs.users[dbs.events[a].username].batiment_en_amelioration.indexOf(dbs.events[a].batiment),1);
						}
						dbs.events[a]=null;
						break;
					case "combat":
						let atkant=dbs.users[dbs.events[a].atk];
						let defant=dbs.users[dbs.events[a].def];
						if(atkant&&defant){
							this.usercheck(dbs.events[a].atk);
							this.usercheck(dbs.events[a].def);
							let mol_used_by_atkant=[];
							let old_defmols=JSON.parse(JSON.stringify(defant.molecules));
							let old_atkmols=JSON.parse(JSON.stringify(atkant.molecules));
							let defmols=[];
							let atkmols=[];
							for(let b=0;b<5;b++){
								if(old_atkmols[b]){
									old_atkmols[b].number=dbs.events[a].mols[b];
								}
								if(defant.molecules[b]&&defant.molecules[b].number){
									defmols.push({
										"number":defant.molecules[b].number,
										"deg":md.power_atome(defant,b,0),
										"PV":md.power_atome(defant,b,4),
										"molid":b
									});
								}
								if(atkant.molecules[b]&&dbs.events[a].mols[b]>0){
									atkmols.push({
										"number":dbs.events[a].mols[b],
										"deg":md.power_atome(atkant,b,1),
										"PV":md.power_atome(atkant,b,4),
										"molid":b
									});
									old_atkmols[b].number=dbs.events[a].mols[b]
									mol_used_by_atkant.push(b);
								}
							}
							do{
								//calcul des dégats a infliger
								let totdef=0;
								for(let g=0;g<defmols.length;g++){
									totdef+=defmols[g].deg*defmols[g].number;
								}
								defant.points.defense+=totdef;
								let totatk=0;
								for(let h=0;h<atkmols.length;h++){
									totatk+=atkmols[h].deg*atkmols[h].number;
								}
								atkant.points.attaque+=totatk;
								//oblitération des classes
								for(let i=0;i<defmols.length;i++){
									if(defmols[i].PV*defmols[i].number>totatk){
										defmols[i].number-=totatk/defmols[i].PV;
										defant.points.pertes_combat+=totatk/defmols[i].PV;
										totatk=0;
									}else{
										defant.points.pertes_combat+=defmols[i].number;
										totatk-=defmols[i].PV*defmols[i].number;
										defmols[i].number=0;
									}
								}
								for(let i=0;i<atkmols.length;i++){
									if(atkmols[i].PV*atkmols[i].number>totdef){
										atkmols[i].number-=totdef/atkmols[i].PV;
										atkant.points.pertes_combat+=totdef/atkmols[i].PV;
										totdef=0;
									}else{
										atkant.points.pertes_combat+=atkmols[i].number;
										totdef-=atkmols[i].PV*atkmols[i].number;
										atkmols[i].number=0;
									}
								}
								//élimination des points d'atk ou de def qui n'ont pas servis
								defant.points.defense-=totdef;
								atkant.points.attaque-=totatk;
								//élimination des classe détruites entièrement
								let d=0;
								let templen1=atkmols.length;
								for(let c=0;c<templen1;c++){
									if(atkmols[d].number==0){
										atkmols.splice(d,1);
										d--;
									}
									d++;
								}
								let f=0;
								let templen2=defmols.length;
								for(let e=0;e<templen2;e++){
									if(defmols[f].number==0){
										defmols.splice(f,1);
										f--;
									}
									f++;
								}
								//lorsqu'il ne reste rien
							}while(defmols.length>0&&atkmols.length>0);
							for(let b=0;b<5;b++){
								if(defant.molecules[b]){
									defant.molecules[b].number=0;
									for(let c of defmols){
										if(c.molid==b){
											defant.molecules[b].number+=c.number;
										}
									}
								}
							}
							if(defmols.length==0&&atkmols.length==0){
								//égalité
								for(let b of mol_used_by_atkant){
									atkant.molecules_en_utilisation[b]--;
								}
								//Rapports
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Egalite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":null,
									"time":dbs.events[a].time
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Egalite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":null,
									"time":dbs.events[a].time
								}
								atkant.raports.push(atk_report);
								defant.raports.push(def_report);
							}else if(defmols.length==0){
								//victoire d'atk
								//Destruction
								let destruction_log=[0,0,0];
								let a_detruire=0;
								for(let b of atkmols){
									a_detruire+=md.power_atome(atkant,b.molid,5)*b.number;
								}
								rest_batiments=[true,true,true];
								rest_batiment=3;
								temp_rest_batiment=3;
								do{
									if(defant.batiments.protecteur>0){
										let absorbed_by_protector=defant.batiments.protecteur*a_detruire/100;
										a_detruire-=absorbed_by_protector;
										if(absorbed_by_protector<defant.PV_batiments.protecteur){
											defant.PV_batiments.protecteur-=absorbed_by_protector;
											atkant.points.destruction+=absorbed_by_protector;
										}else{
											atkant.points.destruction+=defant.PV_batiments.protecteur;
											absorbed_by_protector-=defant.PV_batiments.protecteur;
											defant.PV_batiments.protecteur=0;
											defant.batiments.protecteur--;
											defant.PV_batiments.protecteur=10**(defant.batiments.protecteur/20)*10*defant.batiments.protecteur;
											defant.points.batiments-=5;
											a_detruire+=absorbed_by_protector;
										}
									}
									let restdestruction=0;
									if(rest_batiment>0){
										for(let b=0;b<3;b++){
											if(rest_batiments[b]){
												let destrbatiment=a_detruire*atkant.QG.destruction[b]/4/rest_batiment;
												if(defant.PV_batiments[md.batiments[b]]>destrbatiment){
													defant.PV_batiments[md.batiments[b]]-=destrbatiment;
													atkant.points.destruction+=destrbatiment;
													destruction_log[b]+=destrbatiment/(10**(defant.batiments[md.batiments[b]]/20)*1000);
												}else{
													if(defant.batiments[md.batiments[b]]==0){
														rest_batiments[b]=false;
														temp_rest_batiment--;
													}else{
														destrbatiment-=defant.PV_batiments[md.batiments[b]];
														atkant.points.destruction+=defant.PV_batiments[md.batiments[b]];
														destruction_log[b]=Math.floor(destruction_log[b])+1;
														defant.batiments[md.batiments[b]]--;
														defant.points.batiments-=1;
														defant.PV_batiments[md.batiments[b]]=10**(defant.batiments[md.batiments[b]]/20)*1000;
														restdestruction+=destrbatiment;
													}
												}
											}
										}
									}
									rest_batiment=temp_rest_batiment;
									a_detruire=restdestruction;
								}while(a_detruire>0);
								//Pillage
								let pillage_log=[0,0,0,0,0,0,0,0];
								let a_piller=0;
								for(let b of atkmols){
									a_piller+=md.power_atome(atkant,b.molid,6)*b.number;
								}
								rest_atomes=[true,true,true,true,true,true,true,true];
								rest_atome=8;
								temp_rest_atome=8;
								do{
									let restpillage=0;
									if(rest_atome>0){
										for(let b=0;b<8;b++){
											if(rest_atomes[b]){
												let pillatome=a_piller*atkant.QG.pillage[b]/4/rest_atome;
												if(defant.ressources[md.atomes[b]]>pillatome){
													defant.ressources[md.atomes[b]]-=pillatome;
													atkant.ressources[md.atomes[b]]+=pillatome;
													atkant.points.pillage+=pillatome;
													pillage_log[b]+=pillatome;
												}else{
													pillatome-=defant.ressources[md.atomes[b]];
													atkant.ressources[md.atomes[b]]+=defant.ressources[md.atomes[b]];
													atkant.points.pillage+=defant.ressources[md.atomes[b]];
													pillage_log[b]+=defant.ressources[md.atomes[b]];
													defant.ressources[md.atomes[b]]=0;
													rest_atomes[b]=false;
													temp_rest_atome--;
													restpillage+=pillatome;
												}
											}
										}
									}
									rest_atome=temp_rest_atome;
									a_piller=restpillage;
								}while(a_piller>0);
								//Rapports
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Victoire",
									"pillage":pillage_log,
									"destruction":destruction_log,
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":"atk",
									"time":dbs.events[a].time
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Defaite",
									"pillage":pillage_log,
									"destruction":destruction_log,
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":"atk",
									"time":dbs.events[a].time
								}
								for(let b of atkmols){
									let mol={};
									for(let c of md.atomes){
										mol[c]=atkant.molecules[b.molid][c];
									}
									mol.number=b.number;
									atk_report.mol_restantes.push(mol);
									def_report.mol_restantes.push(mol);
								}
								atkant.raports.push(atk_report);
								defant.raports.push(def_report);
								//Evenement de retour
								let return_event={
									"type":"return",
									"time":0,
									"username":dbs.events[a].atk,
									"used_mols":mol_used_by_atkant,
									"rest_mols":[]
								}
								let dx=atkant.positionX-defant.positionX;
								let dy=atkant.positionY-defant.positionY;
								for(let b of atkmols){
									return_event.rest_mols.push({
										"molid":b.molid,
										"number":b.number
									});
									return_event.time=Math.max(return_event.time,Date.now()+Math.hypot(dx,dy)*60*60*1000/md.power_atome(atkant,b.molid,7));
								}
								dbs.events.push(return_event);
							}else if(atkmols.length==0){
								//victoire de def
								for(let b of mol_used_by_atkant){
									atkant.molecules_en_utilisation[b]--;
								}
								//Rapports
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Defaite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":"def",
									"time":dbs.events[a].time
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Victoire",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[],
									"old_defmols":old_defmols,
									"old_atkmols":old_atkmols,
									"defant":dbs.events[a].def,
									"atkant":dbs.events[a].atk,
									"win":"def",
									"time":dbs.events[a].time
								}
								for(let b of defmols){
									let mol=defant.molecules[b.molid];
									mol.number=b.number;
									atk_report.mol_restantes.push(mol);
									def_report.mol_restantes.push(mol);
								}
								atkant.raports.push(atk_report);
								defant.raports.push(def_report);
							}
							dbs.events[a]=null;
						}else{
							dbs.events[a]=null;
						}
						break;
					case "return":
						if(dbs.users[dbs.events[a].username]){
							for(let b of dbs.events[a].used_mols){
								dbs.users[dbs.events[a].username].molecules_en_utilisation[b]--;
							}
							for(let b of dbs.events[a].rest_mols){
								dbs.users[dbs.events[a].username].molecules[b.molid].number+=b.number;
							}
							dbs.events[a]=null;
						}else{
							dbs.events[a]=null;
						}
						break;
					case "molecule":
						let user=dbs.users[dbs.events[a].username];
						if(user){
							elapsed_time=Date.now()-dbs.events[a].time;
							mol_creatable=Math.floor(elapsed_time/dbs.events[a].create_time)+1;
							time_in_more=elapsed_time%dbs.events[a].create_time;
							if(dbs.events[a].rest_mols>mol_creatable){
								dbs.events[a].rest_mols-=mol_creatable;
								dbs.events[a].time=Date.now()+dbs.events[a].create_time-time_in_more;
								user.molecules[dbs.events[a].molecule].number+=mol_creatable;
							}else{
								user.molecules[dbs.events[a].molecule].number+=dbs.events[a].rest_mols;
								dbs.events[a]=null;
							}
						}
						break;
					case "espionnage":
						
						break;
					case "send":
						let to_user=dbs.users[dbs.events[a].to];
						if(to_user){
							for(let b of md.ressources){
								to_user.ressources[b]+=dbs.events[a].ressources[b];
							}
						}
						dbs.events[a]=null;
						break;
				}
			}
		}
		let b=0;
		let l=dbs.events.length;
		for(let a=0;a<l;a++){
			if(dbs.events[b]==null){
				dbs.events.splice(b,1);
				b--;
			}
			b++;
		}
	},
	usercheck:function(user,token=null){
		if(dbs.users[user]){
			let tempEcoule=Date.now()-dbs.users[user].lastUserCheck;
			for(let a in md.atomes){
				dbs.users[user].ressources[md.atomes[a]]+=(10**(dbs.users[user].batiments.producteur/15)*10)*(dbs.users[user].QG.production[a]/4)*(tempEcoule/(1000*60*60));
				dbs.users[user].ressources[md.atomes[a]]=Math.min(10**(dbs.users[user].batiments.stockage/15)*100*(dbs.users[user].QG.production[a]/4),dbs.users[user].ressources[md.atomes[a]]);
			}
			dbs.users[user].ressources["energie"]+=(10**(dbs.users[user].batiments.generateur/15)*100)*(tempEcoule/(1000*60*60));
			dbs.users[user].ressources["energie"]=Math.min(10**(dbs.users[user].batiments.stockage/15)*1000,dbs.users[user].ressources["energie"]);
			for(let a=0;a<5;a++){
				if(dbs.users[user].molecules[a]){
					let old_mol=dbs.users[user].molecules[a].number;
					dbs.users[user].molecules[a].number/=2**((tempEcoule/(1000*60))/md.power_atome(dbs.users[user],a,3));
					dbs.users[user].points.pertes_temps+=old_mol-dbs.users[user].molecules[a].number;
				}
			}
			dbs.users[user].points.total=dbs.users[user].points.batiments;
			for(let a in md.medailles){
				for(let b=0;b<10;b++){
					if(dbs.users[user].points[md.points_medailles[a]]>=md.multiplacateur_medailles[a]*md.seuils_medailes[b]){
						dbs.users[user].medailles[md.medailles[a]]=b;
					}
				}
				dbs.users[user].points.total+=Math.log(dbs.users[user].points[md.points_medailles[a]]/md.multiplacateur_medailles[a]+1)*15;
			}
			dbs.users[user].lastUserCheck=Date.now();
			if(dbs.connections[token]==user){
				return(dbs.users);
			}
		}
		return false;
	},
	gamecheck:function(){
		//Classement
		let classement=[]
		for(let a in dbs.users){
			if(dbs.users[a].actif){
				classement.push({
					user:a,
					team:dbs.users[a].alliance,
					victoires:dbs.users[a].ressources.victoires,
					points:dbs.users[a].points
				});
			}
		}
		classement.sort(function(a,b){
			return b.points.total-a.points.total;
		});
		dbs.MDS.classement=classement;
		let classement_team=[]
		for(let a in dbs.teams){
			if(a!="NONETEAM"){
				let sum=0;
				let nb_membres=0;
				for(let b of dbs.teams[a].membres){
					if(dbs.users[b].actif){
						sum+=dbs.users[b].points.total;
						nb_membres++;
					}
				}
				if(nb_membres>0){
					classement_team.push({
						team:a,
						victoires:dbs.teams[a].ressources.victoires,
						somme:sum,
						membres:nb_membres,
						moyenne:sum/nb_membres
					});
				}
			}
		}
		classement_team.sort(function(a,b){
			return b.moyenne-a.moyenne;
		});
		dbs.MDS.classement_team=classement_team;
		//Réinitialisation mensuelle
		if(Date.now()>new Date(dbs.MDS.actual_game.year,dbs.MDS.actual_game.month+1).getTime()){
			dbs.MDS.actual_game.year=new Date().getFullYear();
			dbs.MDS.actual_game.month=new Date().getMonth();
			//Classement de victoire
			for(let a=0;a<classement.length;a++){
				dbs.users[dbs.MDS.classement[a].user].ressources.victoires+=50/(a+1)-2*a+50;
			}
			for(let a=0;a<classement_team.length;a++){
				dbs.teams[dbs.MDS.classement_team[a].team].ressources.victoires+=50/(a+1)-2*a+50;
			}
			//Réinitialisation mensuelles
			dbs.connections={};
			for(let a in dbs.users){
				dbs.users[a].ressources={
					"energie":500,
					"carbone":50,
					"oxygene":50,
					"azote":50,
					"iode":50,
					"brome":50,
					"hydrogene":50,
					"soufre":50,
					"chlore":50,
					"victoires":dbs.users[a].ressources.victoires,
				}
				dbs.users[a].batiments={
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
				}
				dbs.users[a].batiment_en_amelioration=[];
				dbs.users[a].points={
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
				}
				dbs.users[a].PV_batiments={
					"generateur":1000,
					"producteur":1000,
					"stockage":1000,
					"protecteur":0
				}
				dbs.users[a].molecules=[null,null,null,null,null];
				dbs.users[a].molecules_en_utilisation=[0,0,0,0,0];
				dbs.users[a].medailles={
					"def":-1,
					"atk":-1,
					"mol":-1,
					"tps":-1,
					"prt":-1,
					"des":-1,
					"pil":-1,
					"cmb":-1
				}
				dbs.users[a].raports=[];
				dbs.users[a].positionX=null;
				dbs.users[a].positionY=null;
				dbs.users[a].actif=false;
			}
			for(let a in dbs.teams){
				if(a!="NONETEAM"){
					dbs.teams[a].ressources={
						"energie":0,
						"carbone":0,
						"oxygene":0,
						"azote":0,
						"iode":0,
						"brome":0,
						"hydrogene":0,
						"soufre":0,
						"chlore":0,
						"victoires":dbs.teams[a].ressources.victoires
					}
					dbs.teams[a].requetes_ressources=[];
				}
			}
			dbs.events=[];
			dbs.connections={};
			dbs.MDS.classement=[];
			dbs.MDS.map={"in_teams_progress":{"NONETEAM":0},"progress":3};
		}
	}
}
