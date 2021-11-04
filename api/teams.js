const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports = {
	name:'teams',
	GET:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		switch(body.mode){
			case "detailed":
				if(checkmodule.usercheck(body.username,body.token)){
						res.writeHead(200,{'Content-Type':'application/json'});
						data=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
						res.write(JSON.stringify(data[body.username]));
						res.end();
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
				if(data[body.username]){
					let response={
						"points":data[body.username].points,
						"medailles":data[body.username].medailles,
						"positionX":data[body.username].positionX,
						"positionY":data[body.username].positionY,
						"alliance":data[body.username].alliance,
						"description":data[body.username].description,
						"victoires":data[body.username].ressources.victoires,
						"permission":data[body.username].permission,
						"actif":data[body.username].actif
					}
				}else{
					res.writeHead(404);
					res.write("User not found");
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
							members:[body.username],
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
	}
}
