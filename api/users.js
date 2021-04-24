const usercheck = require("../functions/usercheck");

usercheck=require("../functions/usercheck");
module.exports = {
    name:'users',
    GET:function(req,res,body){
        usercheck();
        res.writeHead(200);
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify({username: "Anonymail", password: "ABCD"}))
        res.end()
    },
    PUT:function(req,res,body){
        //new user
    },
    WS:(ws,req)=>{
        console.log(ws)
    }
}
