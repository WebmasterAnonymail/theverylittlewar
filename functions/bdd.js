const http=require("http");
function httpRequestSync(method,host,url){
	let ret=null;
	let options={
//		hostname:host,
		port:80,
		path:url,
		method:method,
		headers:{
			"Content-Type":"application/json",
			"Accept":"application/json"
		},
	}
	let req=http.request(options,(res)=>{
		console.log("pre")
		data="";
		res.on('data',d=>{
			data+=String(d)
		});
		res.on('end',d=>{
			console.log("OK")
			ret={"status":"SUCESS","data":data};
			console.log("OK")
		});
	});
	req.on('error',error=>{
		console.log("KO")
		ret={"status":"FAIL","error":error};
		console.log("KO")
	});
	req.end();
	console.log("pre3")
	while(!ret){};
	console.log("continue")
	if(ret.status=="FAIL"){
		throw ret.error;
	}else{
		return(ret.data);
	}
}
module.exports={
	readFileSync:function(file){
		return httpRequestSync("GET","jsonblob.com","/api/916626526636883968s")
	},
	writeFileSync:function(file){
		
	}
}