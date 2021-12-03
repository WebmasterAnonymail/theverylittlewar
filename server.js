const http=require('http');
const ws=require('ws');
const fs=require('fs');
const handler=require('./mainHandler.js'); 
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server({server:httpServer});
console.log("Démarage");
httpServer.listen(process.env.app_port||process.env.PORT||process.env.port||8000);
wsServer.on("connection",handler.ws);
//	fs.writeFileSync(process.env.storage_root+"","{}");
if(process.env.reset_files=="yes"){
	fs.writeFileSync(process.env.storage_root+"events.json","[]");
	fs.writeFileSync(process.env.storage_root+"users.json","{}");
	fs.writeFileSync(process.env.storage_root+"alliances.json","{}");
	fs.writeFileSync(process.env.storage_root+"connections.json","{}");
}
