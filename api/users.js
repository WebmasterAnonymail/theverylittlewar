//var bddServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
const fs=require("fs");
const usercheck=require("../functions/usercheck")
module.exports = {
    name:'users',
    GET:function(req,res,body){
        usercheck();
        res.writeHead(200);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({username: "Anonymail", password: "ABCD"}));
        res.end();
    },
    PUT:function(req,res,body){
		data=require("/mnt/users.json");
		body_data=JSON.parse(body);
		if(body_data.username&&body_data.password){
			if(data[body_data.username]){
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Already used\"}");
				res.end();
			}else{
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
						"points":0,
						"victoires":0,
					},
					"batiments":{
						"generateur":1,
						"producteur":1,
						"stockage":1,
						"forteresse":0,
						"ionisateur":0,
						"lieur":0,
						"stabilisateur":0,
						"champDeForce":0,
						"usineDExplosif":0,
						"condenseur":0,
						"booster":0,
					},
					"molecules":[null,null,null,null,null],
					"medailles":undefined, //reste a définir
					"raports":[],
					"positionX":undefined, //idem
					"positionY":undefined, //idem
					"messagesPerso":[],
					"aliance":null,
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write(JSON.stringify({"error":"aucun nom d'utilisateur ou aucun mot de passe"}));
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(data));
    },
    WS:(ws,req)=>{
        console.log(ws)
    }
}
