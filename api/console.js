const checkmodule=require("../functions/check.js");
const fs=require("fs");
module.exports={
	name:'console',
	PATCH:(req,res,body)=>{
		body_data=JSON.parse(body);
		response=[]
		for(a of body_data){
			try{
				response.push(eval(a.toString()))
			}catch(err){
				response.push({erreur:err.stack})
			}
		}
		res.writeHead(200,{'Content-Type':'application/json'});
		res.write(JSON.stringify(response));
		res.end();
	}
}
