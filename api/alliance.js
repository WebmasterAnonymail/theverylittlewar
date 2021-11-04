const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports = {
	name:'alliance',
	GET:(req,res,body)=>{
		
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let alliances=JSON.parse(fs.readFileSync(process.env.storage_root+"alliances.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(body.name_alliance){
				if(alliances[body.name_alliance]){
					res.writeHead(409);
					res.write("Already used");
					res.end();
				}else{
					if(users[body.username].ressources.energie>=100000){
						alliances[body.name_alliance]={
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
							}
						}
						users[body.username].alliance=body.name_alliance;
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
				res.write("Please give an alliance name");
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"alliances.json",JSON.stringify(alliances));
	}
}
