const mysql=require('mysql2')

const con=mysql.createConnection({
    host:'121.242.232.211',
    user:'emsroot',
    password:'22@teneT',
    database:'EMS',
    port:3306
})
con.connect((err)=>{
    if(err){
        console.log("EMS DB not connected")
    }
    else{
        console.log(' EMS DB connected......')
    }
})


const meterDb=mysql.createConnection({
    host:'121.242.232.211',
    user:'emsroot',
    password:'22@teneT',
    database:'meterdata',
    port:3306
})
meterDb.connect((err)=>{
    if(err){
        console.log("METERDATA DB not connected")
    }
    else{
        console.log(' METERDATA DB connected......')
    }
})


const hashtic=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'22@teneT',
    database:'HASHTIC',
    port:3306
})
hashtic.connect((err)=>{
    if(err){
        console.log("HASHTIC DB not connected")
    }
    else{
        console.log(' HASHTIC DB connected......')
    }
})



const chakradb=mysql.createConnection({
    host:'121.242.232.151',
    user:'emsrouser',
    password:'emsrouser@151',
    database:'bmsmgmt_olap_prod_v13',
    port:3306
})

chakradb.connect((err)=>{
    if(err){
        console.log("Chakra DB not connected")
    }
    else{
        console.log('Chakra DB connected......')
    }
})

const unprocesseddata=mysql.createConnection({
    host:'121.242.232.151',
    user:'emsrouser',
    password:'emsrouser@151',
    database:'bmsmgmtprodv13',
    port:3306

})
unprocesseddata.connect((err)=>{
    if(err){
        console.log("unprocesseddata not connected")
    }
    else{
        console.log('unprocesseddata connected......')
    }

})







 
module.exports={con,chakradb,unprocesseddata,hashtic,meterDb};
