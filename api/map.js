const checkmodule=require("../functions/check.js");
const md=require("../functions/miscdatas.js");
const fs=require("fs");
module.exports = {
	name:'users',
	GET:(req,res,body)=>{
		let users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
		let teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
		let MDS=JSON.parse(fs.readFileSync(process.env.storage_root+"maindatastorage.json"));
		let res=[];
		for(user in users){
			if(users[user].actif){
				let size=0;
				size+=Number(Boolean(users[user].alliance));
				size+=Number(users[user].points.total>500);
				team=users[user].alliance||"NONETEAM";
				res.push({
					"x":users[user].positionX,
					"y":users[user].positionY,
					"color":teams[team].color,
					"size":Math.floor(users[user].)
				});
			}
		}
	}
}