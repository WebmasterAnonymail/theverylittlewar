const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'map',
	GET:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		let MDS=JSON.parse(fs.readFileSync(process.env.storage_root+"maindatastorage.json"));
		let result=[];
		for(user in users){
			if(users[user].actif){
				let size=0;
				size+=Number(Boolean(users[user].alliance));
				size+=Number(users[user].points.total>100);
				size+=Number(users[user].points.total>1000);
				size+=Number(Boolean(users[user].molecules[0]||users[user].molecules[1]||users[user].molecules[2]||users[user].molecules[3]||users[user].molecules[4]));
				size+=Number(Boolean(users[user].molecules[0]&&users[user].molecules[1]&&users[user].molecules[2]&&users[user].molecules[3]&&users[user].molecules[4]));
				team=users[user].alliance||"NONETEAM";
				result.push({
					"x":users[user].positionX,
					"y":users[user].positionY,
					"color":teams[team].color,
					"size":size,
					"user":user,
					"team":team,
					"points":users[user].points.total
				});
			}
		}
		res.writeHead(200,{'Content-Type':'application/json'})
		res.write(JSON.stringify(result));
		res.end();
	}
}