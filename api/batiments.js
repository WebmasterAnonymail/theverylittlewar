const fs=require("fs");
const checkmodule=require("../fuctions/check.js");
module.exports = {
	name:'batiments',
	POST:function(req,res,body){
		let data=require("/mnt/users.json");
		let body_data=JSON.parse(body);
		if(checkmodule.usercheck(body_data.username,body_data.token)){
			switch(body_data.batiment){
				case "generateur":
					
					break;
				case "producteur":
					
					break;
				case "stockage":
					
					break;
				default:
					
					break;
			}
		}
		fs.writeFileSync("/mnt/users.json",JSON.stringify(data));
	}
}
