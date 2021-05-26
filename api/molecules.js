const fs=require("fs");
const checkmodule=require("../functions/check.js");
var atomes=[
"carbone",
"oxygene",
"azote",
"iode",
"brome",
"hydrogene",
"soufre",
"chlore"
];
var medailles=[
"def",
"atk",
"mol",
"tps",
"prt",
"des",
"pil",
"cmb"
];
var batiment_augmentateurs=[
"forteresse",
"ionisateur",
"lieur",
"stabilisateur",
"champDeForce",
"usineDExplosif",
"condenseur",
"booster"
];
function power_atome(utilisateur,molecule,atome){
	let result=(25**(utilisateur.molecules[molecule][atomes[atome]]/200)*40);
	result*=1+(utilisateur.batiments[batiment_augmentateurs[atome]]/100);
	result*=1+(utilisateur.medailles[medailles[atome]]/10);
	//dupli
	return result;
}
module.exports = {
	name:'molecules',
	POST:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let events=require("/mnt/events.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			if(users[body_data.username].molecules[body_data.mol_id]){
				let energy_cost=0;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].carbone;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].oxygene;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].azote;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].iode;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].brome;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].hydrogene;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].soufre;
				energy_cost+=users[body_data.username].molecules[body_data.mol_id].chlore;
				energy_cost**=1.5;
				energy_cost/=1000;
				if(
				(users[body_data.username].molecules[body_data.mol_id].carbone*body_data.mol_number>users[body_data.username].ressources.carbone)||
				(users[body_data.username].molecules[body_data.mol_id].oxygene*body_data.mol_number>users[body_data.username].ressources.oxygene)||
				(users[body_data.username].molecules[body_data.mol_id].azote*body_data.mol_number>users[body_data.username].ressources.azote)||
				(users[body_data.username].molecules[body_data.mol_id].iode*body_data.mol_number>users[body_data.username].ressources.iode)||
				(users[body_data.username].molecules[body_data.mol_id].brome*body_data.mol_number>users[body_data.username].ressources.brome)||
				(users[body_data.username].molecules[body_data.mol_id].hydrogene*body_data.mol_number>users[body_data.username].ressources.hydrogene)||
				(users[body_data.username].molecules[body_data.mol_id].soufre*body_data.mol_number>users[body_data.username].ressources.soufre)||
				(users[body_data.username].molecules[body_data.mol_id].chlore*body_data.mol_number>users[body_data.username].ressources.chlore)||
				(energy_cost*body_data.mol_number>users[body_data.username].ressources.energie)
				){
					res.writeHead(402,{'Content-Type':'application/json'});
					res.end();
				}else{
					event_mol={
						"username":body_data.username,
						"time":(new Date()).getTime()+(1000*60*60)/power_atome(users[body_data.username],body_data.mol_id,2),
						"type":"molecule",
						"molecule":body_data.mol_id,
						"rest_mols":body_data.mol_numbers-1,
						"create_time":(1000*60*60)/power_atome(users[body_data.username],body_data.mol_id,2)
					};
					events.push(event_mol);
					users[body_data.username].ressources.energie-=energy_cost*body_data.mol_number;
					users[body_data.username].ressources.carbone-=users[body_data.username].molecules[body_data.mol_id].carbone*body_data.mol_number;
					users[body_data.username].ressources.oxygene-=users[body_data.username].molecules[body_data.mol_id].oxygene*body_data.mol_number;
					users[body_data.username].ressources.azote-=users[body_data.username].molecules[body_data.mol_id].azote*body_data.mol_number;
					users[body_data.username].ressources.iode-=users[body_data.username].molecules[body_data.mol_id].iode*body_data.mol_number;
					users[body_data.username].ressources.brome-=users[body_data.username].molecules[body_data.mol_id].brome*body_data.mol_number;
					users[body_data.username].ressources.hydrogene-=users[body_data.username].molecules[body_data.mol_id].hydrogene*body_data.mol_number;
					users[body_data.username].ressources.soufre-=users[body_data.username].molecules[body_data.mol_id].soufre*body_data.mol_number;
					users[body_data.username].ressources.chlore-=users[body_data.username].molecules[body_data.mol_id].chlore*body_data.mol_number;
					
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
		fs.writeFileSync("/mnt/events.json",JSON.stringify(events));
	},
	PUT:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			if(users[body_data.username].molecules[body_data.mol_id]==null){
				if(10**(body_data.mol_id)>users[body_data.username].ressources.energie){
					res.writeHead(402,{'Content-Type':'application/json'});
					res.end();
				}else{
					let ok=true;
					for(let a of atomes){
						if((body_data[a]<0)||(body_data[a]>200)||(body_data[a]!=Math.floor(body_data[a]))||(typeof body_data[a]!="number")){
							ok=false;
						}
					}
					if(ok){
							users[body_data.username].molecules[body_data.mol_id]={
							"carbone":body_data.carbone,
							"oxygene":body_data.oxygene,
							"azote":body_data.azote,
							"iode":body_data.iode,
							"brome":body_data.brome,
							"hydrogene":body_data.hydrogene,
							"soufre":body_data.soufre,
							"chlore":body_data.chlore,
							"number":0
						};
						users[body_data.username].ressources.energie-=10**(body_data.mol_id);
					}else{
						res.writeHead(406,{'Content-Type':'application/json'});
						res.end();
					}
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(users));
	},
	DELETE:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			if(users[body_data.username].molecules[body_data.mol_id]){
				users[body_data.username].molecules[body_data.mol_id]=null;
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
	}
}