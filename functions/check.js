var atomes=[
"carbone",
"oxygene",
"azote",
"iode",
"brome",
"hydrogene",
"soufre",
"chlore"
]
module.exports={
	eventcheck:function(){
		let events=require("/mnt/events.json");
		let users=require("/mnt/users.json");
		for(let a of events){
			if(a.time>(new Date()).getTime()){
				switch(a.type){
					case "amelioration":
						if(users[a.username]){
							users[a.username].batiments[a.batiment]++;
						}
						break;
					case "combat":
						//le plus dur =]
						break;
					case "molecule":
						if(users[a.username]){
							users[a.username].molecules[a.molecule]++;
							if(a.rest_mols>0){
								a.rest_mols--;
								a.time+=a.create_time;
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
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	},
	usercheck:function(user,token){
		let connections=require("/mnt/connections.json");
		let users=require("/mnt/users.json");
		let now=(new Date()).getTime();
		let tempEcoule=(now-users[user].lastUserCheck);
		for(let a in atomes){
			users[user].ressources[atomes[a]]+=(/*une formule*/1)*(users[user].QG.production[a]/4)*(tempEcoule/(1000*60*60));
			users[user].ressources[atomes[a]]=min(10**(users[user].batiments.stockage/20)*100,users[user].ressources[atomes[a]]);
		}
		users[user].ressources["energie"]+=(/*une formule*/1)*(tempEcoule/(1000*60*60));
		users[user].ressources["energie"]=min(10**(users[user].batiments.stockage/20)*1000,users[user].ressources["energie"]);
		for(let a=0;a<5;a++){
			users[user].molecules[a]/=2**((tempEcoule/(1000*60))/(25**(users[user].molecules[a].iode/200)*40));
		}
		users[user].lastUserCheck=now;
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		return (connections[token]==user)&&(connections[token]!=undefined)
	}
}
