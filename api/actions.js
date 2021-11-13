const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'actions',
	GET:(req,res,body)=>{
		
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			switch(body.action){
				case "attaquer_user":
					if(users[body.target]){
						if(body.target!=body.username){
							if(users[body.target].actif){
								let OK1=true;
								for(let a=0;a<5;a++){
									if(body["mol"+a]==null){
										body["mol"+a]=0;
									}
									if(typeof body["mol"+a]=="number"){
										if(users[body.username].molecules[a]){
											if(body["mol"+a]>users[body.username].molecules[a].number){
												OK1=false;
											}
										}else{
											if(body["mol"+a]>0){
												OK1=false;
											}
										}
									}else{
										OK1=false;
									}
								}
								if(OK1){
									let dx=users[body.target].positionX-users[body.username].positionX;
									let dy=users[body.target].positionY-users[body.username].positionY;
									event_cmb={
										"def":body.target,
										"atk":body.username,
										"time":0,
										"type":"combat",
										"mols":[0,0,0,0,0]
									};
									for(let a=0;a<5;a++){
										if(body["mol"+a]>0){
											users[body.username].molecules_en_utilisation[a]+=1;
											users[body.username].molecules[a].number-=body["mol"+a];
											event_cmb.mols[a]=body["mol"+a];
											event_cmb.time=Math.max(event_cmb.time,Date.now()+Math.hypot(dx,dy)*60*60*1000/md.power_atome(users[body.username],a,7));
										}
									}
									users[body.username].points.combats++;
									events.push(event_cmb);
									res.writeHead(200,{'Content-Type':'application/json'});
									res.end();
								}else{
									res.writeHead(402);
									res.write("You dont have enough molecules");
									res.end();
								}
							}else{
								res.writeHead(403);
								res.write("You cannot attack an inactive user");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("You cannot attack yourself");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("User not exist");
						res.end();
					}
					break;
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(events));
	}
}