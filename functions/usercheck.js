module.exports=function(userid,token){
	connections=require("../storage/connections.json");
	return (connections[token]==userid)&&(connections[token]!=undefined)
}
