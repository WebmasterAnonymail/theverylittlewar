const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'teams',
	GET:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		switch(body.mode){
			case "detailed":
				if(checkmodule.usercheck(body.username,body.token)){
					if(users[body.username].alliance){
						let data=teams[users[body.username].alliance];
						if(data){
							res.writeHead(200,{'Content-Type':'application/json'});
							res.write(JSON.stringify(data));
							res.end();
						}else{
							users.alliance=null;
							res.writeHead(410);
							res.write("Team not exist more");
							res.end();
							fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
						}
					}else{
						res.writeHead(404);
						res.write("No teams");
						res.end();
					}
				}else{
					res.writeHead(401);
					res.write("Not connected");
					res.end();
				}
				break;
			case "list":
				let response=[];
				for(let a in teams){
					response.push(a);
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify(response));
				res.end();
				break;
			case "one":
				if(data[body.team]){
					let response={
						
					}
				}else{
					res.writeHead(404);
					res.write("Team not found");
					res.end();
				}
				break;
		}
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(body.name_team){
				if(teams[body.name_team]){
					res.writeHead(409);
					res.write("Already used");
					res.end();
				}else{
					if(users[body.username].ressources.energie>=100000){
						teams[body.name_team]={
							membres:[body.username],
							chef:body.username,
							grades:{},
							"ressources":{
								"energie":0,
								"carbone":0,
								"oxygene":0,
								"azote":0,
								"iode":0,
								"brome":0,
								"hydrogene":0,
								"soufre":0,
								"chlore":0,
								"victoires":0,
							},
							"description":null,
							"diplomatie":{
								"pactes":[],
								"guerres":[]
							},
							"requetes_ressources":[]
						}
						users[body.username].alliance=body.name_team;
						users[body.username].ressources.energie-=100000;
						res.writeHead(204);
						res.end();
					}else{
						res.writeHead(402);
						res.write("Not enough energy");
						res.end();
					}
				}
			}else{
				res.writeHead(400);
				res.write("Please give an team name");
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(teams));
	},
	PATCH:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			switch(body.action){
				case "change_description":
					if(teams[users[body.username].alliance]){
						if(md.has_team_permission(body.username,"description")){
							teams[users[body.username].alliance].description=body.description;
							res.writeHead(200);
							res.end();
						}else{
							res.writeHead(403);
							res.write("Forbidden");
							res.end();
						}
					}else{
						res.writeHead(400);
						res.write("You have no team");
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
	},
	POST:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			switch(body.action){
				case "give":
					if(teams[users[body.username].alliance]){
						let OK=true;
						for(let a of md.ressources){
							if(typeof(body[a])=="number"){
								if(body[a]<0){
									OK=false;
								}
							}else{
								if(body[a]==null){
									body[a]=0;
								}else{
									OK=false;
								}
							}
						}
						if(OK){
							for(let b of md.ressources){
								if(body[b]>users[body.username].ressources[b]){
									OK=false;
								}
							}
							if(OK){
								for(let c of md.ressources){
									users[body.username].ressources[c]-=body[c];
									teams[users[body.username].alliance].ressources[c]+=body[c];
									res.writeHead(200);
									res.end();
								}
							}else{
								res.writeHead(402);
								res.write("No enough ressources");
								res.end();
							}
						}else{
							res.writeHead(400);
							res.write("Bad values");
							res.end();
						}
					}else{
						res.writeHead(400);
						res.write("You have no team");
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
	}
}
