module.exports = {
    name:'connect',
    POST:(req,res,body)=>{
        //new URL("http://"+req.headers.host+req.url)
        res.writeHead(200);
        res.write("DONE")
        res.end()
    }
}