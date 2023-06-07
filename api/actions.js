const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
module.exports = {
	name:'actions',
	GET:(req,res,body)=>{
		
	},
	PUT:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			switch(body.action){
				case "attaquer_user":
					if(dbs.users[body.target]){
						if(body.target!=body.username){
							if(dbs.users[body.target].actif){
								let OK1=true;
								for(let a=0;a<5;a++){
									if(body["mol"+a]==null){
										body["mol"+a]=0;
									}
									if(typeof body["mol"+a]=="number"){
										if(user.molecules[a]){
											if(body["mol"+a]>user.molecules[a].number){
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
									let dx=dbs.users[body.target].positionX-user.positionX;
									let dy=dbs.users[body.target].positionY-user.positionY;
									let event_cmb={
										"def":body.target,
										"atk":body.username,
										"time":Date.now(),
										"type":"combat",
										"mols":[0,0,0,0,0]
									};
									for(let a=0;a<5;a++){
										if(body["mol"+a]>0){
											user.molecules_en_utilisation[a]+=1;
											user.molecules[a].number-=body["mol"+a];
											event_cmb.mols[a]=body["mol"+a];
											event_cmb.time=Math.max(event_cmb.time,Date.now()+Math.hypot(dx,dy)*60*60*1000/md.power_atome(user,a,7));
										}
									}
									user.points.combats++;
									dbs.events.push(event_cmb);
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
				case "donner":
					if(dbs.users[body.target]){
						if(body.target!=body.username){
							if(dbs.users[body.target].actif){
								let OK1=true;
								for(let a of md.ressources){
									if(body[a]==null){
										body[a]=0;
									}
									if(typeof body[a]=="number"){
										if(body[a]>user.ressources[a]){
											OK1=false;
										}
									}else{
										OK1=false;
									}
								}
								if(OK1){
									let dx=dbs.users[body.target].positionX-user.positionX;
									let dy=dbs.users[body.target].positionY-user.positionY;
									let event_gft={
										"to":body.target,
										"from":body.username,
										"time":0,
										"type":"send",
										"ressources":{}
									};
									for(let a of md.ressources){
										user.ressources[a]-=body[a];
										event_gft.ressources[a]=body[a];
									}
									event_gft.time=Date.now()+Math.hypot(dx,dy)*60*1000;
									user.points.combats++;
									dbs.events.push(event_gft);
									res.writeHead(200,{'Content-Type':'application/json'});
									res.end();
								}else{
									res.writeHead(402);
									res.write("You dont have enough ressources");
									res.end();
								}
							}else{
								res.writeHead(403);
								res.write("You cannot give to an inactive user");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("You cannot give to yourself");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("User not exist");
						res.end();
					}
					break;
				case "attaquer_team":
					if(dbs.teams[body.target]){
						if(body.target!=user.alliance){
							if(user.alliance){
								if(dbs.teams[user.alliance].diplomatie.guerres.indexOf(body.target)!=-1){
									let OK1=true;
									for(let a=0;a<5;a++){
										if(body["mol"+a]==null){
											body["mol"+a]=0;
										}
										if(typeof body["mol"+a]=="number"){
											if(user.molecules[a]){
												if(body["mol"+a]>user.molecules[a].number){
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
										let teammapdatas=dbs.MDS.map.in_teams_progress[body.target]
										let dx=teammapdatas.Xpos*5;-user.positionX;
										let dy=teammapdatas.Ypos*5;-user.positionY;
										let event_cmb={
											"def":body.target,
											"atk":body.username,
											"time":Date.now(),
											"type":"cmb_team",
											"mols":[0,0,0,0,0]
										};
										for(let a=0;a<5;a++){
											if(body["mol"+a]>0){
												user.molecules_en_utilisation[a]+=1;
												user.molecules[a].number-=body["mol"+a];
												event_cmb.mols[a]=body["mol"+a];
												event_cmb.time=Math.max(event_cmb.time,Date.now()+Math.hypot(dx,dy)*60*60*1000/md.power_atome(user,a,7));
											}
										}
										user.points.combats++;
										dbs.events.push(event_cmb);
										res.writeHead(200,{'Content-Type':'application/json'});
										res.end();
									}else{
										res.writeHead(402);
										res.write("You dont have enough molecules");
										res.end();
									}
								}else{
									res.writeHead(409);
									res.write("You must be in war with the target");
									res.end();
								}
							}else{
								res.writeHead(409);
								res.write("You must have a team");
								res.end();
							}
						}else{
							res.writeHead(403);
							res.write("You cannot attack your own team");
							res.end();
						}
					}else{
						res.writeHead(404);
						res.write("Team not exist");
						res.end();
					}
					break;
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
	}
}