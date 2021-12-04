const http=require("http");
const fs=require("fs");
module.exports=function(){
	global.dbs={users:null,teams:null,connections:null,events:null,MDS:null};
	console.log("Getting databases");
	dbs.users=JSON.parse(fs.readFileSync(process.env.storage_root+"users.json"));
	dbs.teams=JSON.parse(fs.readFileSync(process.env.storage_root+"teams.json"));
	dbs.connections=JSON.parse(fs.readFileSync(process.env.storage_root+"connections.json"));
	dbs.events=JSON.parse(fs.readFileSync(process.env.storage_root+"events.json"));
	dbs.MDS=JSON.parse(fs.readFileSync(process.env.storage_root+"maindatastorage.json"));
	setInterval(function(){
		fs.writeFileSync(process.env.storage_root+"users.json",JSON.stringify(dbs.users));
		fs.writeFileSync(process.env.storage_root+"teams.json",JSON.stringify(dbs.teams));
		fs.writeFileSync(process.env.storage_root+"connections.json",JSON.stringify(dbs.connections));
		fs.writeFileSync(process.env.storage_root+"events.json",JSON.stringify(dbs.events));
		fs.writeFileSync(process.env.storage_root+"maindatastorage.json",JSON.stringify(dbs.MDS));
	},5000)
}
/**
jsonblob.com
users:/api/916675126075080704
teams:/api/916675221059289088
connections:/api/916675005757276160
events:/api/916675909403295744
MDS:/api/916675272389181440
*/