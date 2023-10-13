const mysql=require('mysql2')

const con=mysql.createConnection({
    host:'43.205.196.66',
    user:'emsroot',
    password:'22@teneT',
    database:'EMS',
    port:3307
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
    host:'43.205.196.66',
    user:'emsroot',
    password:'22@teneT',
    database:'meterdata',
    port:3307
})
meterDb.connect((err)=>{
    if(err){
        console.log("METERDATA DB not connected")
    }
    else{
        console.log(' METERDATA DB connected......')
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
        console.log(' unprocesseddata not  connected......')
    }
    else{
        console.log('unprocesseddata connected......')
    }

})


const EMSDB=mysql.createConnection({
    host:'121.242.232.211',
    user:'emsroot',
    password:'22@teneT',
    database:'EMS',
    port:3306
})
EMSDB.connect((err)=>{
    if(err){
        console.log("EMSDB  not connected")
    }
    else{
        console.log(' EMSDB  connected......')
    }
})




 
module.exports={con,chakradb,unprocesseddata,meterDb,EMSDB};
