const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'molecules',
	POST:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(user.molecules[body.mol_id]){
				if((typeof(body.mol_number)=="number")&&(body.mol_number!=0)){
					let energy_cost=0;
					energy_cost+=user.molecules[body.mol_id].carbone;
					energy_cost+=user.molecules[body.mol_id].oxygene;
					energy_cost+=user.molecules[body.mol_id].azote;
					energy_cost+=user.molecules[body.mol_id].iode;
					energy_cost+=user.molecules[body.mol_id].brome;
					energy_cost+=user.molecules[body.mol_id].hydrogene;
					energy_cost+=user.molecules[body.mol_id].soufre;
					energy_cost+=user.molecules[body.mol_id].chlore;
					energy_cost**=1.5;
					energy_cost/=10;
					if(
					(user.molecules[body.mol_id].carbone*body.mol_number>user.ressources.carbone)||
					(user.molecules[body.mol_id].oxygene*body.mol_number>user.ressources.oxygene)||
					(user.molecules[body.mol_id].azote*body.mol_number>user.ressources.azote)||
					(user.molecules[body.mol_id].iode*body.mol_number>user.ressources.iode)||
					(user.molecules[body.mol_id].brome*body.mol_number>user.ressources.brome)||
					(user.molecules[body.mol_id].hydrogene*body.mol_number>user.ressources.hydrogene)||
					(user.molecules[body.mol_id].soufre*body.mol_number>user.ressources.soufre)||
					(user.molecules[body.mol_id].chlore*body.mol_number>user.ressources.chlore)||
					(energy_cost*body.mol_number>user.ressources.energie)
					){
						res.writeHead(402);
						res.write("Not enough ressources");
						res.end();
					}else{
						let existing_mol_event=-1;
						for(let a in dbs.events){
							if(dbs.events[a].type=="molecule"
							&&dbs.events[a].username==body.username
							&&dbs.events[a].molecule==body.mol_id){
								existing_mol_event=a;
							}
						}
						if(existing_mol_event<0){
							event_mol={
								"username":body.username,
								"time":Date.now()+(1000*60*60)/md.power_atome(user,body.mol_id,2),
								"type":"molecule",
								"molecule":body.mol_id,
								"rest_mols":body.mol_number,
								"create_time":(1000*60*60)/md.power_atome(user,body.mol_id,2)
							};
							dbs.events.push(event_mol);
						}else{
							dbs.events[existing_mol_event].rest_mols+=body.mol_number;
						}
						user.ressources.energie-=energy_cost*body.mol_number;
						user.ressources.carbone-=user.molecules[body.mol_id].carbone*body.mol_number;
						user.ressources.oxygene-=user.molecules[body.mol_id].oxygene*body.mol_number;
						user.ressources.azote-=user.molecules[body.mol_id].azote*body.mol_number;
						user.ressources.iode-=user.molecules[body.mol_id].iode*body.mol_number;
						user.ressources.brome-=user.molecules[body.mol_id].brome*body.mol_number;
						user.ressources.hydrogene-=user.molecules[body.mol_id].hydrogene*body.mol_number;
						user.ressources.soufre-=user.molecules[body.mol_id].soufre*body.mol_number;
						user.ressources.chlore-=user.molecules[body.mol_id].chlore*body.mol_number;
						user.points.molecules_crees+=body.mol_number;
						res.writeHead(200);
						res.write("DONE");
						res.end();
					}
				}else{
					res.writeHead(406);
					res.write("Null value");
					res.end();
				}
			}else{
				res.writeHead(400);
				res.write("Molecule not exist");
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
	},
	PUT:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(user.molecules[body.mol_id]==null){
				if(10**(body.mol_id+1)>user.ressources.energie){
					res.writeHead(402);
					res.end();
				}else{
					let ok=true;
					for(let a of md.atomes){
						if(body[a]<0) ok=false;
						if(body[a]>200) ok=false;
						if(((body[a]!=Math.floor(body[a]))||(typeof body[a]!="number"))&&(body[a]!=null)){
							ok=false;
						}
					}
					if(ok){
						user.molecules[body.mol_id]={
							"carbone":Number(body.carbone),
							"oxygene":Number(body.oxygene),
							"azote":Number(body.azote),
							"iode":Number(body.iode),
							"brome":Number(body.brome),
							"hydrogene":Number(body.hydrogene),
							"soufre":Number(body.soufre),
							"chlore":Number(body.chlore),
							"number":0
						};
						user.ressources.energie-=10**(body.mol_id+1);
						res.writeHead(200);
						res.end();
					}else{
						res.writeHead(406);
						res.write("Atoms number have to be integer between 0 and 200");
						res.end();
					}
				}
			}else{
				res.writeHead(409);
				res.write("Molecule already exist");
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
	},
	DELETE:(req,res,body)=>{
		if(checkmodule.usercheck(body.username,body.token)){
			let user=dbs.users[body.username];
			if(user.molecules[body.mol_id]){
				if(user.molecules_en_utilisation[body.mol_id]>0){
					res.writeHead(403);
					res.write("You can't delete a molecule in battle");
					res.end();
				}else{
					user.molecules[body.mol_id]=null;
					let b=0;
					for(let a=0;a<dbs.events.length;a++){
						if(dbs.events[b].type=="molecule"
						&&dbs.events[b].username==body.username
						&&dbs.events[b].molecule==body.mol_id){
							dbs.events.splice(b,1);
							b--
						}
						b++;
					}
					res.writeHead(200);
					res.end();
				}
			}else{
				res.writeHead(409);
				res.write("Molecule not exist");
				res.end();
			}
		}else{
			res.writeHead(401);
			res.write("Not connected");
			res.end();
		}
	}
}