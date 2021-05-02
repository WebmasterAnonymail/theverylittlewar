module.exports={
	eventcheck:function(){
		let events=require("/mnt/events.json");
		let users=require("/mnt/users.json");
		for a of events{
			if(a.time>(new Date()).getTime();){
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
								a.time+=a.creat_time;
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
		users[user].lastUserCheck=(new Date()).getTime();
		
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		return (connections[token]==user)&&(connections[token]!=undefined)
	}
}
