const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
function power_atome(utilisateur,molecule,atome){
	let result=(25**(utilisateur.molecules[molecule][md.atomes[atome]]/200)*40);
	result*=1+(utilisateur.batiments[md.batiment_augmentateurs[atome]]/100);
	result*=1+(utilisateur.medailles[md.medailles[atome]]/10);
	//dupli
	return result;
}
module.exports = {
	name:'molecules',
	POST:(req,res,body)=>{
		let users=require("/mnt/users.json");
		let events=require("/mnt/events.json");
		let bd=JSON.parse(body);
		if(checkmodule.usercheck(bd.username,bd.token)){
			if(users[bd.username].molecules[bd.mol_id]){
				let energy_cost=0;
				energy_cost+=users[bd.username].molecules[bd.mol_id].carbone;
				energy_cost+=users[bd.username].molecules[bd.mol_id].oxygene;
				energy_cost+=users[bd.username].molecules[bd.mol_id].azote;
				energy_cost+=users[bd.username].molecules[bd.mol_id].iode;
				energy_cost+=users[bd.username].molecules[bd.mol_id].brome;
				energy_cost+=users[bd.username].molecules[bd.mol_id].hydrogene;
				energy_cost+=users[bd.username].molecules[bd.mol_id].soufre;
				energy_cost+=users[bd.username].molecules[bd.mol_id].chlore;
				energy_cost**=1.5;
				energy_cost/=1000;
				if(
				(users[bd.username].molecules[bd.mol_id].carbone*bd.mol_number>users[bd.username].ressources.carbone)||
				(users[bd.username].molecules[bd.mol_id].oxygene*bd.mol_number>users[bd.username].ressources.oxygene)||
				(users[bd.username].molecules[bd.mol_id].azote*bd.mol_number>users[bd.username].ressources.azote)||
				(users[bd.username].molecules[bd.mol_id].iode*bd.mol_number>users[bd.username].ressources.iode)||
				(users[bd.username].molecules[bd.mol_id].brome*bd.mol_number>users[bd.username].ressources.brome)||
				(users[bd.username].molecules[bd.mol_id].hydrogene*bd.mol_number>users[bd.username].ressources.hydrogene)||
				(users[bd.username].molecules[bd.mol_id].soufre*bd.mol_number>users[bd.username].ressources.soufre)||
				(users[bd.username].molecules[bd.mol_id].chlore*bd.mol_number>users[bd.username].ressources.chlore)||
				(energy_cost*bd.mol_number>users[bd.username].ressources.energie)
				){
					res.writeHead(402,{'Content-Type':'application/json'});
					res.write("{error:\"Not enough ressources\"}");
					res.end();
				}else{
					event_mol={
						"username":bd.username,
						"time":new Date().getTime()+(1000*60*60)/power_atome(users[bd.username],bd.mol_id,2),
						"type":"molecule",
						"molecule":bd.mol_id,
						"rest_mols":bd.mol_numbers-1,
						"create_time":(1000*60*60)/power_atome(users[bd.username],bd.mol_id,2)
					};
					events.push(event_mol);
					users[bd.username].ressources.energie-=energy_cost*bd.mol_number;
					users[bd.username].ressources.carbone-=users[bd.username].molecules[bd.mol_id].carbone*bd.mol_number;
					users[bd.username].ressources.oxygene-=users[bd.username].molecules[bd.mol_id].oxygene*bd.mol_number;
					users[bd.username].ressources.azote-=users[bd.username].molecules[bd.mol_id].azote*bd.mol_number;
					users[bd.username].ressources.iode-=users[bd.username].molecules[bd.mol_id].iode*bd.mol_number;
					users[bd.username].ressources.brome-=users[bd.username].molecules[bd.mol_id].brome*bd.mol_number;
					users[bd.username].ressources.hydrogene-=users[bd.username].molecules[bd.mol_id].hydrogene*bd.mol_number;
					users[bd.username].ressources.soufre-=users[bd.username].molecules[bd.mol_id].soufre*bd.mol_number;
					users[bd.username].ressources.chlore-=users[bd.username].molecules[bd.mol_id].chlore*bd.mol_number;
					
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"Molecule not exist\"}");
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
		let bd=JSON.parse(body);
		if(checkmodule.usercheck(bd.username,bd.token)){
			if(users[bd.username].molecules[bd.mol_id]==null){
				if(10**(bd.mol_id)>users[bd.username].ressources.energie){
					res.writeHead(402,{'Content-Type':'application/json'});
					res.end();
				}else{
					let ok=true;
					for(let a of md.atomes){
						if((bd[a]<0)||(bd[a]>200)||(bd[a]!=Math.floor(bd[a]))||(typeof bd[a]!="number")){
							ok=false;
						}
					}
					if(ok){
							users[bd.username].molecules[bd.mol_id]={
							"carbone":bd.carbone,
							"oxygene":bd.oxygene,
							"azote":bd.azote,
							"iode":bd.iode,
							"brome":bd.brome,
							"hydrogene":bd.hydrogene,
							"soufre":bd.soufre,
							"chlore":bd.chlore,
							"number":0
						};
						console.log(users)
						users[bd.username].ressources.energie-=10**(bd.mol_id);
						res.writeHead(200,{'Content-Type':'application/json'});
						res.end();
					}else{
						res.writeHead(406,{'Content-Type':'application/json'});
						res.write("{error:\"Atoms number have to be integer between 0 and 200\"}");
						res.end();
					}
				}
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"Molecule already exist\"}");
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
		let bd=JSON.parse(body);
		if(checkmodule.usercheck(bd.username,bd.token)){
			if(users[bd.username].molecules[bd.mol_id]){
				users[bd.username].molecules[bd.mol_id]=null;
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}else{
				res.writeHead(400,{'Content-Type':'application/json'});
				res.write("{error:\"Molecule not exist\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
	}
}