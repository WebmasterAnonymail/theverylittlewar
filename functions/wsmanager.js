module.exports={
	warn_userdatas:function(username){
		for(let a in wss){
			if(wss[a].user==username){
				wss[a].ws.send("USR|UPDATED");
			}else{
				wss[a].ws.send("CLS|UPDATED");
			}
		}
	}
}