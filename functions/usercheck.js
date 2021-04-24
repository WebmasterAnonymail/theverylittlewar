mysql=require("mysql")
config=require("../config.json")
bdd=mysql.createConnection(config.mysql);
bdd.connect();
module.exports=function(userid,token){
    now_date=new Date();
    console.log(mysql.escape(now_date))
    //a mettre a la fin
    bdd.end(); 
}
