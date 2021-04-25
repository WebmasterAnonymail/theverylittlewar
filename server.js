const http=require('http');
var util=require('util');
const ws=require('ws');
const nano=require('nano');
const handler=require('./mainHandler.js'); 
const config=require("./config.json");
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server({server:httpServer});
console.log("Démarage");
httpServer.listen(config.http.port);
wsServer.on("connection",handler.ws)
