const fs=require('fs');
const toSlice='/';
var api={};
var files=fs.readdirSync('./api');
if(!files){
    console.error('[Err] Aucun fichier d\'api chargé');
}
for(let i in files){
    let prop=require(`./api/${files[i]}`);
    api[prop.name]=prop;
}
module.exports.connect=function(ws,req){
    let name=req.url.slice(toSlice.length);
    if(!api[name]) {
        ws.send("ERR:No api named '"+name+"'");
    }else{
        api[name]["WS"](ws);
    }
}