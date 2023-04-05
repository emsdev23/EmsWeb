

connect.query("select*from EMSInverterData",function(err,result,feilds){
    if(err){
        console.log(err)
    }
    else{
        const response=(JSON.parse(JSON.stringify(result)))
        res.send(response)
        console.log(response)
        
    }
})
module.exports=connect;