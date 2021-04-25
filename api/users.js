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
        bddServer.get("users",(err,data,head)=>{
			if(err&&false){
				res.writeHead(500,{'Content-Type':'application/json'});
				res.write(JSON.stringify(err));
				res.end();
			}else{
				if(req.url||true){
					res.writeHead(200,{'Content-Type':'application/json'});
					res.write(JSON.stringify([req,req.url,new URL(req.url)]));
					res.end()
				}
			}
		})
    },
    WS:(ws,req)=>{
        console.log(ws)
    }
}
