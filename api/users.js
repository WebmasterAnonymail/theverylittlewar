//var bddServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports = {
	name:'users',
	GET:(req,res,body)=>{
		let data=require("/mnt/users.json");
		let bd=JSON.parse(body);
		switch(bd.mode){
			case "detailed":
				let connections=require("/mnt/connections.json");
				if(checkmodule.usercheck(bd.username,bd.token)){
						res.writeHead(200,{'Content-Type':'application/json'});
						data=require("/mnt/users.json");
						res.write(JSON.stringify(data[bd.username]));
						res.end();
				}else{
					res.writeHead(401,{'Content-Type':'application/json'});
					res.write("{error:\"Not connected\"}");
					res.end();
				}
				break;
			case "list":
				let response=[];
				for(let a in data){
					response.push(a);
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.write(JSON.stringify(response));
				res.end();
				break;
			case "one":
				if(data[bd.username]){
					let response={
						"points":data[bd.username].points,
						"medailles":data[bd.username].medailles,
						"positionX":data[bd.username].positionX,
						"positionY":data[bd.username].positionY,
						"aliance":data[bd.username].aliance,
						"description":data[bd.username].description,
						"victoires":data[bd.username].ressources.victoires,
						"permission":data[bd.username].permission,
						"actif":data[bd.username].actif
					}
				}else{
					res.writeHead(404,{'Content-Type':'application/json'});
					res.write("{error:\"User not found\"}");
					res.end();
				}
				break;
		}
	},
	PUT:(req,res,body)=>{
		let data=require("/mnt/users.json");
		let bd=JSON.parse(body);
		if(bd.username&&bd.password){
			if(data[bd.username]){
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Already used\"}");
				res.end();
			}else{
				let px=undefined;
				let py=undefined;
				data[bd.username]={
					"password":bd.password,
					"ressources":{
						"energie":500,
						"carbone":50,
						"oxygene":50,
						"azote":50,
						"iode":50,
						"brome":50,
						"hydrogene":50,
						"soufre":50,
						"chlore":50,
						"victoires":0,
					},
					"batiments":{
						"generateur":0,
						"producteur":0,
						"stockage":0,
						"forteresse":0,
						"ionisateur":0,
						"lieur":0,
						"stabilisateur":0,
						"champdeforce":0,
						"usinedexplosif":0,
						"condenseur":0,
						"booster":0,
						"protecteur":0
					},
					"QG":{
						"production":[4,4,4,4,4,4,4,4,4,4,4,4],
						"pillage":[4,4,4,4,4,4,4,4,4,4,4,4],
						"destruction":[4,4,4]
					},
					"points":{
						"batmients":0,
						"defense":0,
						"attaque":0,
						"molecules_crees":0,
						"pertes_temps":0,
						"pertes_combat":0,
						"destruction":0,
						"pillage":0,
						"combats":0
					},
					"PV_batiments":{
						"generateur":0,
						"producteur":0,
						"stockage":0,
					},
					"molecules":[null,null,null,null,null],
					"medailles":{
						"def":-1,
						"atk":-1,
						"mol":-1,
						"tps":-1,
						"prt":-1,
						"des":-1,
						"pil":-1,
						"cmb":-1
					},
					"raports":[],
					"positionX":px,
					"positionY":py,
					"messagesPerso":[],
					"aliance":null,
					"description":null,
					"permission":[],
					"actif":true,
					"lastUserCheck":new Date().getTime()
				};
				res.writeHead(204,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write(JSON.stringify({"error":"aucun nom d'utilisateur ou aucun mot de passe"}));
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(data));
	},
	DELETE:(req,res,body)=>{
		let data=require("/mnt/users.json");
		fs.writeFileSync("/mnt/users.json",JSON.stringify(data));
	}
}
