const http=require('http');
const ws=require('ws');
const fs=require('fs');
const httpHandler=require('./mainHandler.js'); 
const wsHanlder=require('./wsHanlder');
const bddManager=require('./bddManager.js'); 
const checkmodule=require("./functions/check.js");
const httpServer=http.createServer(httpHandler);
const wsServer=new ws.Server({server:httpServer});
//throw "NOPE" //Bloque le serveur
console.log("Démarage");
httpServer.listen(process.env.app_port||process.env.PORT||process.env.port||8000);
wsServer.on("connection",wsHanlder.connect);
bddManager();
wsHanlder.init();
setInterval(function(){
	if(dbs_getting_progress==5){
		checkmodule.eventcheck()
	}
},1000);
setInterval(checkmodule.gamecheck,15000);
