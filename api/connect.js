const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
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
		let connections=JSON.parse(fs.readFileSync(process.env.storage_root+"connections.json"))
		res.writeHead(200,{'Content-Type':'application/json'});
		if(connections[body.token]){
			res.write(JSON.stringify({connected:true,username:connections[body.token]}));
		}else{
			res.write(JSON.stringify({connected:false}));
		}
		res.end();
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		let MDS=JSON.parse(fs.readFileSync(process.env.storage_root+"maindatastorage.json"));
		let connections=JSON.parse(fs.readFileSync(process.env.storage_root+"connections.json"))
		if(users[body["username"]]){
			if(users[body.username].password==body.password){
				if(!users[body.username].actif){
					if(users[body.username].alliance){
						if(!MDS.map.in_teams_progress[users[body.username].alliance]){
							MDS.map.in_teams_progress[users[body.username].alliance]={
								"Xpos":md.map_posX[MDS.map.progress],
								"Ypos":md.map_posY[MDS.map.progress],
								"progress":0
							}
							MDS.map.progress++;
						}
						let team_map_datas=MDS.map.in_teams_progress[users[body.username].alliance];
						users[body.username].positionX=md.map_posX[team_map_datas.progress]+team_map_datas.Xpos*5;
						users[body.username].positionY=md.map_posY[team_map_datas.progress]+team_map_datas.Ypos*5;
						MDS.map.in_teams_progress[users[body.username].alliance].progress++;
					}else{
						CellPX=0;
						CellPY=0;
						if(MDS.map.in_teams_progress.NONETEAM>=25){
							if(MDS.map.in_teams_progress.NONETEAM>=50){
								CellPY=5;
							}else{
								CellPX=5;
							}
						}
						users[body.username].positionX=md.map_posX[MDS.map.in_teams_progress.NONETEAM%25]+CellPX;
						users[body.username].positionY=md.map_posY[MDS.map.in_teams_progress.NONETEAM%25]+CellPY;
						MDS.map.in_teams_progress.NONETEAM++;
					}
					users[body.username].actif=true;
				}
				connect_token=generate_token();
				connections[connect_token]=body.username;
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify({token:connect_token}));
				res.end();
				fs.writeFileSync(process.env.storage_root+"connections.json",JSON.stringify(connections));
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
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
		fs.writeFileSync(process.env.storage_root+"maindatastorage.json",JSON.stringify(MDS));
	},
	DELETE:(req,res,body)=>{
		let connections=JSON.parse(fs.readFileSync(process.env.storage_root+"connections.json"))
		delete connections[body.token];
		res.writeHead(204,{'Content-Type':'application/json'});
		res.end();
		fs.writeFileSync(process.env.storage_root+"connections.json",JSON.stringify(connections));
	}
}