const mysql=require('mysql')

const con=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'22@teneT',
    database:'EMS',
    port:3306
})
con.connect((err)=>{
    if(err){
        console.log("EMS DB not connected")
    }
    else{
        console.log(' EMS DB conneted......')
    }
})


const meterDb=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'22@teneT',
    database:'meterdata',
    port:3306
})
meterDb.connect((err)=>{
    if(err){
        console.log("METERDATA DB not connected")
    }
    else{
        console.log(' METERDATA DB conneted......')
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
        console.log(' HASHTIC DB conneted......')
    }
})



const chakradb=mysql.createConnection({
    host:'121.242.232.151',
    user:'bmsrouser6',
    password:'bmsrouser6@151',
    database:'bmsmgmt_olap_prod_v13',
    port:3306
})

chakradb.connect((err)=>{
    if(err){
        console.log("Chakra DB not connected")
    }
    else{
        console.log('Chakra DB conneted......')
    }
})

const unprocesseddata=mysql.createConnection({
    host:'121.242.232.151',
    user:'bmsrouser6',
    password:'bmsrouser6@151',
    database:'bmsmgmtprodv13',
    port:3306

})
unprocesseddata.connect((err)=>{
    if(err){
        console.log("unprocesseddata not connected")
    }
    else{
        console.log('unprocesseddata conneted......')
    }

})







 
module.exports={con,chakradb,unprocesseddata,hashtic,meterDb};
