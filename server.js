const http=require('http');
const ws=require('ws');
const fs=require('fs');
const handler=require('./mainHandler.js'); 
const bddManager=require('./bddManager.js'); 
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server({server:httpServer});
//throw "NOPE" //Bloque le serveur
console.log("Démarage");
httpServer.listen(process.env.app_port||process.env.PORT||process.env.port||8000);
wsServer.on("connection",handler.ws);
bddManager();
