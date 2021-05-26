const fs=require("fs");
var atomes=[
"carbone",
"oxygene",
"azote",
"iode",
"brome",
"hydrogene",
"soufre",
"chlore"
];
var medailles=[
"def",
"atk",
"mol",
"tps",
"prt",
"des",
"pil",
"cmb"
];
var batiment_augmentateurs=[
"forteresse",
"ionisateur",
"lieur",
"stabilisateur",
"champDeForce",
"usineDExplosif",
"condenseur",
"booster"
];
var seuils_medailes=[1,2,5,10,20,50,100,200,500,1000];
var multiplacateur_medailles=[1000,1000,100,50,50,1000,1000,1];
var points_medailles=[
"defense",
"attaque",
"molecules_crees",
"pertes_temps",
"pertes_combat",
"destruction",
"pillage",
"combats"
];

function power_atome(utilisateur,molecule,atome){
	let result=(25**(utilisateur.molecules[molecule][atomes[atome]]/200)*40);
	result*=1+(utilisateur.batiments[batiment_augmentateurs[atome]]/100);
	result*=1+(utilisateur.medailles[medailles[atome]]/10);
	//dupli
	return result;
}
module.exports={
	eventcheck:function(){
		let events=require("/mnt/events.json");
		let users=require("/mnt/users.json");
		let a_suprimer=[];
		for(let a in events){
			if(events[a].time>(new Date()).getTime()){
				switch(events[a].type){
					case "amelioration":
						if(users[events[a].username]){
							users[events[a].username].batiments[events[a].batiment]++;
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
			let now=(new Date()).getTime();
			let tempEcoule=(now-users[user].lastUserCheck);
			for(let a in atomes){
				users[user].ressources[atomes[a]]+=(10**(users[user].batiments.producteur/20)*10)*(users[user].QG.production[a]/4)*(tempEcoule/(1000*60*60));
				users[user].ressources[atomes[a]]=min(10**(users[user].batiments.stockage/15)*100,users[user].ressources[atomes[a]]);
			}
			users[user].ressources["energie"]+=(10**(users[user].batiments.generateur/20)*100)*(tempEcoule/(1000*60*60));
			users[user].ressources["energie"]=min(10**(users[user].batiments.stockage/15)*1000,users[user].ressources["energie"]);
			for(let a=0;a<5;a++){
				let old_mol=users[user].molecules[a];
				users[user].molecules[a]/=2**((tempEcoule/(1000*60))/(25**(users[user].molecules[a].iode/200)*40));
				users[user].points.pertes_temps+=old_mol-users[user].molecules[a];
			}
			for(let a in medailles){
				for(let b=0;b<10;b++){
					if(users[user].points[points_medailles[a]]>=multiplacateur_medailles[a]*seuils_medailes[b]){
						users[user].medailles[medailles[a]]=b;
					}
				}
			}
			users[user].lastUserCheck=now;
			fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		}
		return (connections[token]==user)&&(connections[token]!=undefined)&&(users[user])
	}
}
