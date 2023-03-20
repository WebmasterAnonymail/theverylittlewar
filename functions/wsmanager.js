module.exports={
	warn_userdatas:function(username,broadcast=true){
		for(let a in wss){
			if(wss[a].user==username){
				console.trace("UPDATE")
			}else if(broadcast){
				wss[a].ws.send("CLS|UPDATED");
			}
		}
	}
}