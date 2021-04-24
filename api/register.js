module.exports = {
    name:'register',
    POST:(req,res,body)=>{
        res.writeHead(200);
        res.write("DONE")
        res.end()
    }
}