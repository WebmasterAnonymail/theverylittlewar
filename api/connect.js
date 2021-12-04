const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
function generate_token(length=50){
	let temp_token=""
	for(a=0;a<length;a++){
		temp_token+=Number(Math.floor(Math.random()*36)).toString(36)
	}
	return temp_token
}
module.exports = {
	name:'connect',
	GET:(req,res,body)=>{
		res.writeHead(200,{'Content-Type':'application/json'});
		if(dbs.connections[body.token]){
			res.write(JSON.stringify({connected:true,username:dbs.connections[body.token]}));
		}else{
			res.write(JSON.stringify({connected:false}));
		}
		res.end();
	},
	PUT:(req,res,body)=>{
		if(dbs.users[body["username"]]){
			if(dbs.users[body.username].password==body.password){
				if(!dbs.users[body.username].actif){
					if(dbs.users[body.username].alliance){
						if(!dbs.MDS.map.in_teams_progress[dbs.users[body.username].alliance]){
							dbs.MDS.map.in_teams_progress[dbs.users[body.username].alliance]={
								"Xpos":md.map_posX[dbs.MDS.map.progress],
								"Ypos":md.map_posY[dbs.MDS.map.progress],
								"progress":0
							}
							dbs.MDS.map.progress++;
						}
						let team_map_datas=dbs.MDS.map.in_teams_progress[dbs.users[body.username].alliance];
						dbs.users[body.username].positionX=md.map_posX[team_map_datas.progress]+team_map_datas.Xpos*5;
						dbs.users[body.username].positionY=md.map_posY[team_map_datas.progress]+team_map_datas.Ypos*5;
						dbs.MDS.map.in_teams_progress[dbs.users[body.username].alliance].progress++;
					}else{
						CellPX=0;
						CellPY=0;
						if(dbs.MDS.map.in_teams_progress.NONETEAM>=25){
							if(dbs.MDS.map.in_teams_progress.NONETEAM>=50){
								CellPY=5;
							}else{
								CellPX=5;
							}
						}
						dbs.users[body.username].positionX=md.map_posX[dbs.MDS.map.in_teams_progress.NONETEAM%25]+CellPX;
						dbs.users[body.username].positionY=md.map_posY[dbs.MDS.map.in_teams_progress.NONETEAM%25]+CellPY;
						dbs.MDS.map.in_teams_progress.NONETEAM++;
					}
					dbs.users[body.username].actif=true;
				}
				connect_token=generate_token();
				dbs.connections[connect_token]=body.username;
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify({token:connect_token}));
				res.end();
			}else{
				res.writeHead(401,{'Content-Type':'application/json'});
				res.write("{error:\"Bad password\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Bad username\"}");
			res.end();
		}
	},
	DELETE:(req,res,body)=>{
		delete dbs.connections[body.token];
		res.writeHead(204,{'Content-Type':'application/json'});
		res.end();
	}
}