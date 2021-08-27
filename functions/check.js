const fs=require("fs");
const md=require("../functions/miscdatas.js")
function power_atome(utilisateur,molecule,atome){
	let result=(25**(utilisateur.molecules[molecule][md.atomes[atome]]/200)*40);
	result*=1+(utilisateur.batiments[md.batiment_augmentateurs[atome]]/100);
	result*=1+(utilisateur.medailles[md.medailles[atome]]/10);
	//dupli
	return result;
}
module.exports={
	eventcheck:function(){
		let events=require("/mnt/events.json");
		let users=require("/mnt/users.json");
		let a_suprimer=[];
		for(let a in events){
			if(events[a].time>new Date().getTime()){
				switch(events[a].type){
					case "amelioration":
						if(users[events[a].username]){
							users[events[a].username].batiments[events[a].batiment]++;
							users[events[a].username].points.batiments+=md.points_batiments[events[a].batiment];
						}
						a_suprimer.push(a);
						break;
					case "combat":
						//le plus dur =]
						break;
					case "molecule":
						if(users[events[a].username]){
							users[events[a].username].molecules[events[a].molecule].number++;
							if(events[a].rest_mols>0){
								events[a].rest_mols--;
								events[a].time+=events[a].create_time;
							}else{
								a_suprimer.push(a);
							}
						}
						break;
					case "espionnage":
						
						break;
					case "return":
						
						break;
					case "send":
						
						break;
				}
			}
		}
		for(let a of a_suprimer){
			events[a]=null;
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
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	},
	usercheck:function(user,token){
		let connections=require("/mnt/connections.json");
		let users=require("/mnt/users.json");
		if(users[user]){
			let now=new Date().getTime();
			let tempEcoule=(now-users[user].lastUserCheck);
			for(let a in md.atomes){
				users[user].ressources[md.atomes[a]]+=(10**(users[user].batiments.producteur/20)*10)*(users[user].QG.production[a]/4)*(tempEcoule/(1000*60*60));
				users[user].ressources[md.atomes[a]]=Math.min(10**(users[user].batiments.stockage/15)*100,users[user].ressources[md.atomes[a]]);
			}
			users[user].ressources["energie"]+=(10**(users[user].batiments.generateur/20)*100)*(tempEcoule/(1000*60*60));
			users[user].ressources["energie"]=Math.min(10**(users[user].batiments.stockage/15)*1000,users[user].ressources["energie"]);
			for(let a=0;a<5;a++){
				if(users[user].molecules[a]){
					let old_mol=users[user].molecules[a];
					users[user].molecules[a]/=2**((tempEcoule/(1000*60))/(25**(users[user].molecules[a].iode/200)*40));
					users[user].points.pertes_temps+=old_mol-users[user].molecules[a];
				}
			}
			for(let a in md.medailles){
				for(let b=0;b<10;b++){
					if(users[user].points[md.points_medailles[a]]>=md.multiplacateur_medailles[a]*md.seuils_medailes[b]){
						users[user].medailles[md.medailles[a]]=b;
					}
				}
			}
			users[user].lastUserCheck=now;
			fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		}
		return (connections[token]==user)&&(connections[token]!=undefined)&&(users[user])
	}
}
