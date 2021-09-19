const http=require('http');
const ws=require('ws');
const fs=require('fs');
const handler=require('./mainHandler.js'); 
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server({server:httpServer});
console.log("Démarage");
httpServer.listen(process.env.app_port||8000);
wsServer.on("connection",handler.ws);
//	fs.writeFileSync("/mnt/","{}");
if(process.env.reset_files=="yes"){
	fs.writeFileSync("/mnt/events.json","[]");
	fs.writeFileSync("/mnt/users.json","{}");
	fs.writeFileSync("/mnt/connections.json","{}");
}

