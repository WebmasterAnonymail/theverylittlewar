module.exports=function(userid,token){
	connections=require("/mnt/connections.json");
	return (connections[token]==userid)&&(connections[token]!=undefined)
}
