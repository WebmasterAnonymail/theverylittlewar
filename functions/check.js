const fs=require("fs");
const md=require("../functions/miscdatas.js")
module.exports={
	eventcheck:function(){
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let a_suprimer=[];
		for(let a in events){
			if(events[a].time<Date.now()){
				switch(events[a].type){
					case "amelioration":
						if(users[events[a].username]){
							users[events[a].username].batiments[events[a].batiment]++;
							users[events[a].username].points.batiments+=md.points_batiments[events[a].batiment];
							users[events[a].username].batiment_en_amelioration.splice(users[events[a].username].batiment_en_amelioration.indexOf(events[a].batiment),1);
						}
						events[a]=null;
						break;
					case "combat":
						let atkant=users[events[a].atk];
						let defant=users[events[a].def];
						if(atkant&&defant){
							let mol_used_by_atkant=[];
							let defmols=[];
							let atkmols=[];
							for(let b=0;b<5;b++){
								if(defant.molecules[b]&&defant.molecules[b].number){
									defmols.push({
										"number":defant.molecules[b].number,
										"deg":md.power_atome(defant,b,0),
										"PV":md.power_atome(defant,b,4),
										"molid":b
									});
								}
								if(atkant.molecules[b]&&events[a].mols[b]>0){
									atkmols.push({
										"number":events[a].mols[b],
										"deg":md.power_atome(atkant,b,1),
										"PV":md.power_atome(atkant,b,4),
										"molid":b
									});
									mol_used_by_atkant.push(b);
								}
							}
							do{
								//calcul des dégats a infliger
								let totdef=0;
								for(let g=0;g<defmols.length;g++){
									totdef+=defmols[g].deg*defmols[g].number;
								}
								users[events[a].def].points.defense+=totdef;
								let totatk=0;
								for(let h=0;h<atkmols.length;h++){
									totatk+=atkmols[h].deg*atkmols[h].number;
								}
								users[events[a].atk].points.attaque+=totatk;
								//oblitération des classes
								for(let i=0;i<defmols.length;i++){
									if(defmols[i].PV*defmols[i].number>totatk){
										defmols[i].number-=totatk/defmols[i].PV;
										users[events[a].def].points.pertes_combat+=totatk/defmols[i].PV;
										totatk=0;
									}else{
										users[events[a].def].points.pertes_combat+=defmols[i].number;
										totatk-=defmols[i].PV*defmols[i].number;
										defmols[i].number=0;
									}
								}
								for(let i=0;i<atkmols.length;i++){
									if(atkmols[i].PV*atkmols[i].number>totdef){
										atkmols[i].number-=totdef/atkmols[i].PV;
										users[events[a].atk].points.pertes_combat+=totdef/atkmols[i].PV;
										totdef=0;
									}else{
										users[events[a].atk].points.pertes_combat+=atkmols[i].number;
										totdef-=atkmols[i].PV*atkmols[i].number;
										atkmols[i].number=0;
									}
								}
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
								if(users[events[a].def].molecules[b]){
									users[events[a].def].molecules.number=0;
									for(let c of defmols){
										if(c.molid==b){
											users[events[a].def].molecules.number+=c.number;
										}
									}
								}
							}
							///NOT ERRORS
							if(defmols.length==0&&atkmols.length==0){
								//égalité
								for(let b of mol_used_by_atkant){
									users[events[a].atk].molecules_en_utilisation[b]--;
								}
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Egalite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[]
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Egalite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[]
								}
								users[events[a].atk].raports.push(atk_report);
								users[events[a].def].raports.push(def_report);
							}else if(defmols.length==0){
								//victoire d'atk
								///DESTRUCTION/PILLAGE
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Victoire",
									"pillage":[0,0,0,0,0,0,0,0]/**TEMP*/,
									"destruction":[0,0,0,0]/**TEMP*/,
									"mol_restantes":[]
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Defaite",
									"pillage":[0,0,0,0,0,0,0,0]/**TEMP*/,
									"destruction":[0,0,0,0]/**TEMP*/,
									"mol_restantes":[]
								}
								for(let b of atkmols){
									let mol={};
									for(let c of md.atomes){
										mol[c]=users[events[a].atk].molecules[b.molid][c];
									}
									mol.number=b.number;
									atk_report.mol_restantes.push(mol);
									def_report.mol_restantes.push(mol);
								}
								users[events[a].atk].raports.push(atk_report);
								users[events[a].def].raports.push(def_report);
								//Evenement de retour
								let return_event={
									"type":"return",
									"time":0,
									"username":events[a].atk,
									"used_mols":mol_used_by_atkant,
									"rest_mols":[]
								}
								let dx=users[events[a].atk].positionX-users[events[a].def].positionX;
								let dy=users[events[a].atk].positionY-users[events[a].def].positionY;
								for(let b of atkmols){
									return_event.rest_mols.push({
										"molid":b.molid,
										"number":b.number
									});
									return_event.time=Math.max(return_event.time,Date.now()+Math.hypot(dx,dy)*60*60*1000/md.power_atome(users[events[a].atk],b.molid,7));
								}
								events.push(return_event);
							}else if(atkmols.length==0){
								//victoire de def
								for(let b of mol_used_by_atkant){
									users[events[a].atk].molecules_en_utilisation[b]--;
								}
								let atk_report={
									"readed":false,
									"type":"combat",
									"result":"Defaite",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[]
								}
								let def_report={
									"readed":false,
									"type":"combat",
									"result":"Victoire",
									"pillage":[0,0,0,0,0,0,0,0],
									"destruction":[0,0,0,0],
									"mol_restantes":[]
								}
								for(let b of defmols){
									let mol=users[events[a].def].molecules[b.molid];
									mol.number=b.number;
									atk_report.mol_restantes.push(mol);
									def_report.mol_restantes.push(mol);
								}
								users[events[a].atk].raports.push(atk_report);
								users[events[a].def].raports.push(def_report);
							}
							events[a]=null;
						}else{
							events[a]=null;
						}
						break;
					case "return":
						if(users[[events[a].username]]){
							for(let b of events[a].used_mols){
								users[events[a].username].molecules_en_utilisation[b]--;
							}
							for(let b of events[a].rest_mols){
								users[events[a].username].molecules[b.molid].number+=b.number;
							}
							events[a]=null;
						}else{
							events[a]=null;
						}
						break;
					case "molecule":
						if(users[events[a].username]){
							elapsed_time=Date.now()-events[a].time;
							mol_creatable=Math.floor(elapsed_time/events[a].create_time)+1;
							time_in_more=elapsed_time%events[a].create_time;
							if(events[a].rest_mols>mol_creatable){
								events[a].rest_mols-=mol_creatable;
								events[a].time=Date.now()+events[a].create_time-time_in_more;
								users[events[a].username].molecules[events[a].molecule].number+=mol_creatable;
							}else{
								users[events[a].username].molecules[events[a].molecule].number+=events[a].rest_mols;
								events[a]=null;
							}
						}
						break;
					case "espionnage":
						
						break;
					case "send":
						
						break;
				}
			}
		}
		let b=0;
		let l=events.length;
		for(let a=0;a<l;a++){
			if(events[b]==null){
				events.splice(b,1);
				b--;
			}
			b++;
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(events));
	},
	usercheck:function(user,token){
		let connections=JSON.parse(fs.readFileSync(process.env.storage_root+"connections.json"))
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"))
		if(users[user]){
			let tempEcoule=Date.now()-users[user].lastUserCheck;
			for(let a in md.atomes){
				users[user].ressources[md.atomes[a]]+=(10**(users[user].batiments.producteur/15)*10)*(users[user].QG.production[a]/4)*(tempEcoule/(1000*60*60));
				users[user].ressources[md.atomes[a]]=Math.min(10**(users[user].batiments.stockage/15)*100*(users[user].QG.production[a]/4),users[user].ressources[md.atomes[a]]);
			}
			users[user].ressources["energie"]+=(10**(users[user].batiments.generateur/15)*100)*(tempEcoule/(1000*60*60));
			users[user].ressources["energie"]=Math.min(10**(users[user].batiments.stockage/15)*1000,users[user].ressources["energie"]);
			for(let a=0;a<5;a++){
				if(users[user].molecules[a]){
					let old_mol=users[user].molecules[a].number;
					users[user].molecules[a].number/=2**((tempEcoule/(1000*60))/md.power_atome(users[user],a,3));
					users[user].points.pertes_temps+=old_mol-users[user].molecules[a].number;
				}
			}
			for(let a in md.medailles){
				for(let b=0;b<10;b++){
					if(users[user].points[md.points_medailles[a]]>=md.multiplacateur_medailles[a]*md.seuils_medailes[b]){
						users[user].medailles[md.medailles[a]]=b;
					}
				}
			}
			users[user].points.total=users[user].points.batiments;
			users[user].lastUserCheck=Date.now();
			fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		}
		return (connections[token]==user)&&(connections[token]!=undefined)&&(users[user]);
	}
}
