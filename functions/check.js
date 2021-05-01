module.exports={
	eventcheck:function(){
		events=require("/mnt/events.json");
		users=require("/mnt/users.json");
		now=(new Date()).getTime();
		for a of events{
			if(a.time>now){
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
				}
			}
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	},
	usercheck:function(user,token){
		connections=require("/mnt/connections.json");
		return (connections[token]==user)&&(connections[token]!=undefined)
	}
}
