const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
module.exports = {
	name:'generalplay',
	GET:(req,res,body)=>{
		let result=[];
		for(user in dbs.users){
			if(dbs.users[user].actif){
				let size=0;
				size+=Number(Boolean(dbs.users[user].alliance));
				size+=Number(dbs.users[user].points.total>100);
				size+=Number(dbs.users[user].points.total>1000);
				size+=Number(Boolean(dbs.users[user].molecules[0]||dbs.users[user].molecules[1]||dbs.users[user].molecules[2]||dbs.users[user].molecules[3]||dbs.users[user].molecules[4]));
				size+=Number(Boolean(dbs.users[user].molecules[0]&&dbs.users[user].molecules[1]&&dbs.users[user].molecules[2]&&dbs.users[user].molecules[3]&&dbs.users[user].molecules[4]));
				team=dbs.users[user].alliance||"NONETEAM";
				result.push({
					"x":dbs.users[user].positionX,
					"y":dbs.users[user].positionY,
					"color":dbs.teams[team].color,
					"size":size,
					"user":user,
					"team":team,
					"points":dbs.users[user].points.total
				});
			}
		}
		res.writeHead(200,{'Content-Type':'application/json'})
		res.write(JSON.stringify(result));
		res.end();
	},
	OPTIONS:(req,res,body)=>{
		if(body.classement=="actual"){
			res.writeHead(200,{'Content-Type':'application/json'})
			res.write(JSON.stringify(dbs.MDS.classement));
		}else if(body.classement=="teams"){
			res.writeHead(200,{'Content-Type':'application/json'})
			res.write(JSON.stringify(dbs.MDS.classement_team));
		}else if(body.classement=="general"){
			let classement_ge=[]
			for(let a in dbs.users){
				classement_ge.push({
					user:a,
					team:dbs.users[a].alliance,
					actif:dbs.users[a].actif,
					victoires:dbs.users[a].ressources.victoires,
					points:dbs.users[a].points.total
				});
			}
			classement_ge.sort(function(a,b){
				return b.victoires-a.victoires;
			});
			res.writeHead(200,{'Content-Type':'application/json'})
			res.write(JSON.stringify(classement_ge));
		}else if(body.classement=="general_teams"){
			let classement_ge=[]
			for(let a in dbs.teams){
				if(a!="NONETEAM"){
					let sum=0;
					let nb_membres=0;
					for(let b of dbs.teams[a].membres){
						if(dbs.users[b].actif){
							sum+=dbs.users[b].points.total;
							nb_membres++;
						}
					}
					classement_ge.push({
						team:a,
						actif:nb_membres>0,
						victoires:dbs.teams[a].ressources.victoires,
						membres:dbs.teams[a].membres.length,
						moyenne:(sum+dbs.teams[a].diplomatie.point_allowance)/nb_membres
					});
				}
			}
			classement_ge.sort(function(a,b){
				return b.victoires-a.victoires;
			});
			res.writeHead(200,{'Content-Type':'application/json'})
			res.write(JSON.stringify(classement_ge));
		}else{
			res.writeHead(404)
		}
		res.end();
	}
}