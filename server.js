var http = require('http');
var util = require('util');
var app_port = process.env.app_port || 8080;
var app_host = process.env.app_host || '127.0.0.1';

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World from Cloudnode\n\n');
    res.end();
}).listen(app_port);
console.log('Web server running at http://' + app_host + ':' + app_port);
// const http=require('http');
// const ws=require('ws');
// const nano=require('nano');
// const handler=require('./mainHandler.js'); 
// const config=require("./config.json");
// const httpServer=http.createServer(handler.http);
// const wsServer=new ws.Server(config.ws);
// var bddServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
// var app_port = process.env.app_port || 8080;
// var app_host = process.env.app_host || '127.0.0.1';
// console.log("Démarage");
// httpServer.listen(app_port);
// wsServer.on("connection",handler.ws)
