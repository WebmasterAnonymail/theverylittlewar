function generate_token(length=50){
	let temp_token=""
	for(a=0;a<length;a++){
		temp_token+=Number(Math.floor(Math.random()*36)).toString(36)
	}
	return temp_token
}
module.exports = {
    name:'connect',
    POST:(req,res,body)=>{
		connect_token=generate_token()
        res.writeHead(200,{'Content-Type':'application/json'});
        res.write(connect_token);
        res.end();
    }
}