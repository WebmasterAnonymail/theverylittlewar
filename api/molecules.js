const fs=require("fs");
const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js")
module.exports = {
	name:'molecules',
	POST:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"))
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"))
		if(checkmodule.usercheck(body.username,body.token)){
			if(users[body.username].molecules[body.mol_id]){
				if((typeof(body.mol_number)=="number")&&(body.mol_number!=0)){
					let energy_cost=0;
					energy_cost+=users[body.username].molecules[body.mol_id].carbone;
					energy_cost+=users[body.username].molecules[body.mol_id].oxygene;
					energy_cost+=users[body.username].molecules[body.mol_id].azote;
					energy_cost+=users[body.username].molecules[body.mol_id].iode;
					energy_cost+=users[body.username].molecules[body.mol_id].brome;
					energy_cost+=users[body.username].molecules[body.mol_id].hydrogene;
					energy_cost+=users[body.username].molecules[body.mol_id].soufre;
					energy_cost+=users[body.username].molecules[body.mol_id].chlore;
					energy_cost**=1.5;
					energy_cost/=10;
					if(
					(users[body.username].molecules[body.mol_id].carbone*body.mol_number>users[body.username].ressources.carbone)||
					(users[body.username].molecules[body.mol_id].oxygene*body.mol_number>users[body.username].ressources.oxygene)||
					(users[body.username].molecules[body.mol_id].azote*body.mol_number>users[body.username].ressources.azote)||
					(users[body.username].molecules[body.mol_id].iode*body.mol_number>users[body.username].ressources.iode)||
					(users[body.username].molecules[body.mol_id].brome*body.mol_number>users[body.username].ressources.brome)||
					(users[body.username].molecules[body.mol_id].hydrogene*body.mol_number>users[body.username].ressources.hydrogene)||
					(users[body.username].molecules[body.mol_id].soufre*body.mol_number>users[body.username].ressources.soufre)||
					(users[body.username].molecules[body.mol_id].chlore*body.mol_number>users[body.username].ressources.chlore)||
					(energy_cost*body.mol_number>users[body.username].ressources.energie)
					){
						res.writeHead(402,{'Content-Type':'application/json'});
						res.write("{error:\"Not enough ressources\"}");
						res.end();
					}else{
						let existing_mol_event=-1;
						for(let a in events){
							if(events[a].type=="molecule"
							&&events[a].username==body.username
							&&events[a].molecule==body.mol_id){
								existing_mol_event=a;
							}
						}
						if(existing_mol_event<0){
							event_mol={
								"username":body.username,
								"time":Date.now()+(1000*60*60)/md.power_atome(users[body.username],body.mol_id,2),
								"type":"molecule",
								"molecule":body.mol_id,
								"rest_mols":body.mol_number,
								"create_time":(1000*60*60)/md.power_atome(users[body.username],body.mol_id,2)
							};
							events.push(event_mol);
						}else{
							events[existing_mol_event].rest_mols+=body.mol_number;
						}
						users[body.username].ressources.energie-=energy_cost*body.mol_number;
						users[body.username].ressources.carbone-=users[body.username].molecules[body.mol_id].carbone*body.mol_number;
						users[body.username].ressources.oxygene-=users[body.username].molecules[body.mol_id].oxygene*body.mol_number;
						users[body.username].ressources.azote-=users[body.username].molecules[body.mol_id].azote*body.mol_number;
						users[body.username].ressources.iode-=users[body.username].molecules[body.mol_id].iode*body.mol_number;
						users[body.username].ressources.brome-=users[body.username].molecules[body.mol_id].brome*body.mol_number;
						users[body.username].ressources.hydrogene-=users[body.username].molecules[body.mol_id].hydrogene*body.mol_number;
						users[body.username].ressources.soufre-=users[body.username].molecules[body.mol_id].soufre*body.mol_number;
						users[body.username].ressources.chlore-=users[body.username].molecules[body.mol_id].chlore*body.mol_number;
						users[body.username].points.molecules_crees+=body.mol_number;
						res.writeHead(200,{'Content-Type':'application/json'});
						res.write("{status:\"DONE\"}");
						res.end();
					}
				}else{
					res.writeHead(406,{'Content-Type':'application/json'});
					res.write("{error:\"Null value\"}");
					res.end();
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
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(events));
	},
	PUT:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"))
		if(checkmodule.usercheck(body.username,body.token)){
			if(users[body.username].molecules[body.mol_id]==null){
				if(10**(body.mol_id+1)>users[body.username].ressources.energie){
					res.writeHead(402,{'Content-Type':'application/json'});
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
						users[body.username].molecules[body.mol_id]={
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
						users[body.username].ressources.energie-=10**(body.mol_id+1);
						res.writeHead(200,{'Content-Type':'application/json'});
						res.end();
					}else{
						res.writeHead(406,{'Content-Type':'application/json'});
						res.write("{error:\"Atoms number have to be integer between 0 and 200\"}");
						res.end();
					}
				}
			}else{
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Molecule already exist\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
	},
	DELETE:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
		if(checkmodule.usercheck(body.username,body.token)){
			if(users[body.username].molecules[body.mol_id]){
				users[body.username].molecules[body.mol_id]=null;
				let b=0;
				for(let a=0;a<events.length;a++){
					if(events[b].type=="molecule"
					&&events[b].username==body.username
					&&events[b].molecule==body.mol_id){
						events.splice(b,1);
						b--
					}
					b++;
				}
				res.writeHead(200,{'Content-Type':'application/json'});
				res.end();
			}else{
				res.writeHead(409,{'Content-Type':'application/json'});
				res.write("{error:\"Molecule not exist\"}");
				res.end();
			}
		}else{
			res.writeHead(401,{'Content-Type':'application/json'});
			res.write("{error:\"Not connected\"}");
			res.end();
		}
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(users));
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(events));
	}
}