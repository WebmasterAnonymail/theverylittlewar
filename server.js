const http=require('http');
const ws=require('ws');
const handler=require('./mainHandler.js'); 
const config=require("./config.json");
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server({server:httpServer});
console.log("Démarage");
httpServer.listen(process.env.app_port);
wsServer.on("connection",handler.ws);
