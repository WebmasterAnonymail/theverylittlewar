module.exports=function(userid,token){
    const nano = require('nano')('http://localhost:5984')
    const db = nano.use('foo');
}
