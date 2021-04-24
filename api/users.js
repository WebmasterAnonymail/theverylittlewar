const nano=require('nano');
var bddServer=nano("http://webmaster31anonymail:rns2F2kcXR@couchdb.cloudno.de:5984/theverylittlewar")
module.exports = {
    name:'users',
    GET:function(req,res,body){
        usercheck();
        res.writeHead(200);
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({username: "Anonymail", password: "ABCD"}));
        res.end();
    },
    PUT:function(req,res,body){
        bddServer.get("users",{revs_info:true},(err,data,head)=>{
			res.writeHead(200);
			res.setHeader('Content-Type','application/json');
			res.write("{"+err+","+data+","+head+"}");
		})
    },
    WS:(ws,req)=>{
        console.log(ws)
    }
}
