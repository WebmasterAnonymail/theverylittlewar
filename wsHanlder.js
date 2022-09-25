module.exports.connect=function(ws,req){
	function tryConnect(data){
		let datas=data.split("|");
		if(datas[0]="CON"){
			if(dbs.connections[datas[1]]){
				let token=datas[1]
				let username=dbs.connections[token];
				ws.off("message",tryConnect)
				wss[datas[1]]={"ws":ws,"user":username};
				ws.on("message",console.log);
				ws.on("close",function(ev){
					delete wss[token];
				});
				ws.send("CON|OK");
			}else{
				ws.send("ERR|This connection not exist");
			}
		}
	}
	ws.on("message",tryConnect);
}
module.exports.init=function(){
	global.wss={};
}