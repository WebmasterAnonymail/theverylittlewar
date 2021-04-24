const http=require('http');
const ws=require('ws');
const handler=require('./mainHandler.js'); 
const config=require("./config.json");
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server(config.ws);
console.log("Démarage");
httpServer.listen(config.http.port,config.http.host);
wsServer.on("connection",handler.ws)