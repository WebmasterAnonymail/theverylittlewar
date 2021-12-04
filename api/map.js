const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
module.exports = {
	name:'map',
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
	}
}