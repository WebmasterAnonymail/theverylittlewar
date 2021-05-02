//var bddServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
const fs=require("fs");
module.exports = {
	name:'users',
	GET:function(req,res,body){
		let data=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		switch(body_data.mode){
			case "detailed":
				let connections=require("/mnt/connections.json");
				if(body_data.token in connections){
					if(connections[body_data.token]==body_data.username){
						res.writeHead(200,{'Content-Type':'application/json'});
						res.write(JSON.stringify(data[body_data.username]));
						res.end();
					}else{
						res.writeHead(403,{'Content-Type':'application/json'});
						res.write("{error:\"Not authorized\"}");
						res.end();
					}
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
				if(data[body_data.username]){
					let response={
						"points":data[body_data.username].points,
						"medailles":data[body_data.username].medailles,
						"positionX":data[body_data.username].positionX,
						"positionY":data[body_data.username].positionY,
						"aliance":data[body_data.username].aliance,
						"description":data[body_data.username].description,
						"positionY":data[body_data.username].positionY,
						"victoires":data[body_data.username].ressources.victoires
					}
				}else{
					res.writeHead(404,{'Content-Type':'application/json'});
					res.write("{error:\"User not found\"}");
					res.end();
				}
				break;
		}
	},
	PUT:function(req,res,body){
		let data=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		if(body_data.username&&body_data.password){
			if(data[body_data.username]){
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Already used\"}");
				res.end();
			}else{
				let px=undefined;
				let py=undefined;
				data[body_data.username]={
					"password":body_data.password,
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
						"champDeForce":0,
						"usineDExplosif":0,
						"condenseur":0,
						"booster":0,
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
						"combats":0,
					},
					"PV_batiments":{ //reste a définir
						"generateur":0,
						"producteur":0,
						"stockage":0,
					},
					"molecules":[null,null,null,null,null],
					"medailles":undefined, //reste a définir
					"raports":[],
					"positionX":px,
					"positionY":py,
					"messagesPerso":[],
					"aliance":null,
					"description":null
				}
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
	DELETE:function(req,res,body){
		let data=require("/mnt/users.json");
		fs.writeFileSync("/mnt/users.json",JSON.stringify(data));
	}
}
