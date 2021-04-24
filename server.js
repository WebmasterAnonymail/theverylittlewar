const http=require('http');
const ws=require('ws');
const handler=require('./mainHandler.js'); 
const config=require("./config.json");
const httpServer=http.createServer(handler.http);
const wsServer=new ws.Server(config.ws);
var app_port = process.env.app_port || 8080;
var app_host = process.env.app_host || '127.0.0.1';
console.log("Démarage");
httpServer.listen(app_port);
wsServer.on("connection",handler.ws)