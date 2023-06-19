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
        console.log(' EMS DB conneted......')
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
        console.log("METER DB not connected")
    }
    else{
        console.log(' METER  DB conneted......')
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


const hashticDb=mysql.createConnection({
    host:'10.200.1.44',
    user:'tenet1',
    password:'22@kingdomS',
    database:'HASTIC',
    port:3306
})
hashticDb.connect((err)=>{
    if(err){
        console.log("HASTIC DB not connected")
    }
    else{
        console.log(' HASTIC DB conneted......')
    }
})








 
module.exports={con,chakradb,unprocesseddata,meterDb,hashticDb};
