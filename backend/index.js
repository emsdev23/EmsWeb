const express=require('express')
const {con,chakradb,unprocesseddata}=require('./connect')
const app=express()
const cors = require("cors");
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const tz = 'Asia/Kolkata'
const password = "*********"

app.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

  app.use(express.json());
// function handleRequest() { }

    app.get("/inverter",async(req,res)=>{
        con.query("SELECT * FROM EMSInverterData WHERE invertertimestamp >= CURDATE() AND invertertimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY)",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    app.get("/wms",async(req,res)=>{
        con.query("SELECT * FROM EMSWMSData WHERE wmstimestamp >= CURDATE() AND wmstimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) order by wmstimestamp desc",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    app.get("/meterdata",async(req,res)=>{
        con.query("  SELECT * FROM EMSMeterData WHERE metertimestamp >= CURDATE() AND metertimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    
    
    app.get("/battery",async(req,res)=>{
        con.query("SELECT * FROM EMSUPSbattery WHERE received_time >= CURDATE() AND received_time < DATE_ADD(CURDATE(), INTERVAL 1 DAY) ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                //res.send(response)

                // for(const i of response){
                //     console.log((i.received_time))
                //     const utcTimeString =i.received_time
                //     const date = new Date(utcTimeString)
                //     const localTimeString = date.toLocaleString();
                //     const minutes = date.getUTCMinutes();
                //     console.log(minutes);
                //     console.log(localTimeString)
                // }
                
                // console.log(response.length)
                const emptyArray=[]
                let data = []; // array to store the data

// Assuming each data point has a timestamp property in ISO format and a value property
let groupedData = response.reduce((accumulator, currentValue) => {
  let timestamp = new Date(currentValue.received_time);
  let hour = timestamp.getHours();
  let minute = timestamp.getMinutes();
  let date=timestamp.getDate()
  let month=timestamp.getMonth()
  let year=timestamp.getFullYear()
  let timeKey = `${hour}:${minute}`;

  if (!accumulator[timeKey]) {
    accumulator[timeKey] = {
      chargingenergy: [],
      dischargingenergy:[],
      pack_usable_soc:[],
      count: 0,
      chargingenergyaverage:0,
      dischargingenergyavg:0,
      packsoc:0,
      batterystaus:'',
      timestamp:[]

    };
  }

  accumulator[timeKey].chargingenergy.push(currentValue.upschargingenergy);
  accumulator[timeKey].dischargingenergy.push(currentValue.negative_energy);
  accumulator[timeKey].pack_usable_soc.push(currentValue.pack_usable_soc);
  accumulator[timeKey].count++;
             // taking average of chargingenergy
  let chargingenergysum = accumulator[timeKey].chargingenergy.reduce((acc, val) => acc + val, 0);
  let chargingenergyavg=chargingenergysum / accumulator[timeKey].chargingenergy.length;
  accumulator[timeKey].chargingenergyaverage=chargingenergyavg

  accumulator[timeKey].timestamp.push(currentValue.received_time)
     
            // taking average of dischargingenergy 
  let dischargingsum=accumulator[timeKey].dischargingenergy.reduce((acc, val) => acc + val, 0);
  let dischargingenergyavg=dischargingsum/accumulator[timeKey].dischargingenergy.length;
  accumulator[timeKey].dischargingenergyavg=dischargingenergyavg

            //taking average of pack soc
 let packsocsum=accumulator[timeKey].pack_usable_soc.reduce((acc, val) => acc + val, 0);
 let packsocavg=packsocsum/accumulator[timeKey].pack_usable_soc.length;
accumulator[timeKey].packsoc=packsocavg

  accumulator[timeKey].batterystaus=currentValue.upsbatterystatus
  //console.log(avg)

  return accumulator;
}, {});


emptyArray.push(groupedData)
//res.send(emptyArray)
const minresult=[]
//looping through the gruped
emptyArray.forEach(obj => {
    for (const key in obj) {
        const chargingEnergyAvg = obj[key].chargingenergyaverage;
        const dischargingenergy=obj[key].dischargingenergyavg;
        const batterystaus=obj[key].batterystaus;
        const packSoc=obj[key].packsoc;
        const timestamp=obj[key].timestamp[0];
        const date = new Date(timestamp)
       const localTimeString = date.toLocaleString();

        minresult.push({'chargingAVG':chargingEnergyAvg,"dischargingAVG":dischargingenergy,"batteryStatus":batterystaus,"timestamp":date,"pack_usable_soc":packSoc})
    }
  });

  









  
  const finalresult=[]
  const calculated=[]
  for (let i = 1; i < minresult.length; i++) {
    const minituesdata=minresult.slice(i,i+15)

      const call=minresult.slice(i,i+15).reduce(
        (accumulator, currentValue) => accumulator+currentValue.dischargingAVG,
        0
      );
      //const avg=call/minituesdata.length
      //console.log(minituesdata.length)

    finalresult.push(minituesdata)
    calculated.push(call)

    // const current = minresult[i];
    // const previous = minresult[i - 1];
    // const chargingDiff = current.chargingAVG - previous.chargingAVG;
    // const dischargingDiff = current.dischargingAVG - previous.dischargingAVG;
    // const timestamp=minresult[i].timestamp
    // const packSocVal=minresult[i].pack_usable_soc
    // const batteryStatus=minresult[i].batteryStatus
    // finalresult.push({'chargingEnergy':chargingDiff,'dischargingEnergy':dischargingDiff,"timestamp":timestamp,"pack_usable_soc":packSocVal,"batteryStatus":batteryStatus})
    // console.log(`Charging difference: ${chargingDiff}`);
    // console.log(`Discharging difference: ${dischargingDiff}`);
  }
  //console.log(calculated)
  res.send(minresult)
  //res.send(finalresult)








                // for(let i=0;i<response.length;i++){
                //     if(response[i].upsbatterystatus==="CHG"){
                //         emptyArray.push(response[i].upschargingenergy)
                //     }
                //     else if(response[i].upsbatterystatus==="DCHG"){
                //         emptyArray.push(response[i].negative_energy)
                //     }
                //     else if(response[i].upsbatterystatus==="IDLE"){
                //         emptyArray.push(0)
                //     }
                // }
            // console.log(emptyArray)
            // res.send(emptyArray)
                //SELECT HOUR(received_time) AS hour, AVG(upschargingenergy) AS chargingenergy, AVG(upsdischargingenergy) AS discharging, AVG(packsoc) AS packsoc FROM EMSUPSbattery WHERE DATE(received_time) = CURDATE() GROUP BY HOUR(received_time) 
            }
        })
        
    })

    //SELECT * FROM EMSUPSbattery WHERE upstimestamp >= CURDATE() AND upstimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) order by upstimestamp desc

    app.get("/sollar",async(req,res)=>{
        chakradb.query(" select * from buildingHourwiseEnergyUsage where date >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)  AND date < CURDATE() AND name IN ('IITMRP', 'Tirunelveli')",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    app.get("/solarPerformance",async(req,res)=>{
        chakradb.query("SELECT * FROM solarPerformanceQuarterHourly  WHERE time >= DATE_SUB(CURDATE(), INTERVAL 1 DAY)  AND time < CURDATE() AND subSystemId=1147 ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    app.get("/sensorreadings",async(req,res)=>{
        unprocesseddata.query("SELECT * FROM sensorreadings WHERE sensorpolledtimestamp >= CURDATE() AND sensorpolledtimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) order by sensorpolledtimestamp desc ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })


    app.get("/acmeterenergy",async(req,res)=>{
        unprocesseddata.query("select * from acmeterreadings WHERE acmeterpolledtimestamp >= CURDATE() AND acmeterpolledtimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND acmetersubsystemid IN (1035,1147) ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })

    app.get("/grid",async(req,res)=>{
        unprocesseddata.query("select * from acmeterreadings WHERE acmeterpolledtimestamp >= CURDATE() AND acmeterpolledtimestamp < DATE_ADD(CURDATE(), INTERVAL 1 DAY) AND acmetersubsystemid IN (1167,1135,358,350) ",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                res.send(response)
                console.log(response.length)
            }
        })
        
    })


    




    // app.get("/db",async(req,res)=>{ })
    // unprocesseddata.query("show tables",function(err,result,feilds){
    //         if(err){
    //             console.log(err)
    //         }
    //         else{
    //             // const response=(JSON.parse(JSON.stringify(result)))
    //             // res.send(response)
    //             console.log(result)
    //         }
    //     })



        // function sendEmail(emailRecipient, value) {
        //     const transporter = nodemailer.createTransport({
        //       host: 'smtp.example.com',
        //       port: 587,
        //       secure: false,
        //       auth: {
        //         user: 'ganeshkalyan506@gmail.com',
        //         pass: 'Ganesh3110#',
        //       },
        //     });
          
        //     const info = transporter.sendMail({
        //       from: 'ganeshkalyan506@gmail.com',
        //       to: 'ganeshr@tenet.res.in',
        //       subject: 'Threshold Exceeded',
        //       text: `The value  has exceeded the threshold of 4000 kVA.`,
        //     });
          
        //     console.log('Email sent: ' + info.response);
        //   }


        //   sendEmail()

        //   var transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //       user: 'arunkumar183107@gmail.com',
        //       pass: 'Arun@280196'
        //     }
        //   });
          
        //   var mailOptions = {
        //     from: 'arunkumar183107@gmail.com',
        //     to: 'ganeshkalyan506@gmail.com',
        //     subject: 'Sending Email using Node.js',
        //     text: 'That was easy!'
        //   };
          
          
        //   transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });

        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.office365.com',
        //     port: 587,
        //     secure: false,
        //     auth: {
        //       user: 'ganeshr@tenet.res.in',
        //       pass: 'Ganesh3110#'
        //     }
        //   });
          
        //   const mailOptions = {
        //     from: 'ganeshr@tenet.res.in',
        //     to: 'arun.kumar@tenet.res.in',
        //     subject: 'Test email',
        //     html: '<h1 >Warning:-Peak Demand has crossed limit of 4000kVA</h1>'
        //   };
          
        //   transporter.sendMail(mailOptions, function(error, info) {
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });

        app.get("/PeakDemand",async(req,res)=>{
            chakradb.query("select * from hvacSchneider7230Polling WHERE polledTime >= CURDATE() AND polledTime < DATE_ADD(CURDATE(), INTERVAL 1 DAY) order by polledTime desc limit 1",function(err,result,feilds){
                if(err){
                    console.log(err)
                }
                else{
                    const response=(JSON.parse(JSON.stringify(result)))
                    //res.send(response)
                    for(let i=0;i<response.length;i++){
                        if(response[i].totalApparentPower2>=3900 && response[i].totalApparentPower2<=4199 ){
                            const date = new Date(response[i].polledTime)
                            const localTimeString = date.toLocaleString();
                            const transporter = nodemailer.createTransport({
                                    host: 'smtp.office365.com',
                                    port: 587,
                                    secure: false,
                                    auth: {
                                      user: 'arun.kumar@tenet.res.in',
                                      pass: 'Arun@280196'
                                    }
                                  });
                                  
                                  const mailOptions = {
                                    from: 'arun.kumar@tenet.res.in',
                                    to: 'energyteam@respark.iitm.ac.in',
                                    subject: 'Peak Demand Limit-level 1 breach',
                                    html: `<h5>Peak Demand Limit-level 1 breach</h5>
                                    
                                    <h5 >Warning:-Peak Demand has crossed limit of ${Math.round(response[i].totalApparentPower2)} KVA at ${localTimeString}</h5>
                                    <h5> Severity:- Medium</h5>
                                    
                                    `
                                  };
                                  //energyteam@respark.iitm.ac.in
                                  //faheera@respark.iitm.ac.in
                                  
                                  transporter.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                       res.send(`Peak Demand has crossed limit of ${response[i].totalApparentPower2} KVA at ${localTimeString}`);
                                    }
                                  });

                        }

                        else if(response[i].totalApparentPower2>=4200 && response[i].totalApparentPower2<=4499 ){
                            const date = new Date(response[i].polledTime)
                            const localTimeString = date.toLocaleString();
                            const transporter = nodemailer.createTransport({
                                    host: 'smtp.office365.com',
                                    port: 587,
                                    secure: false,
                                    auth: {
                                      user: 'arun.kumar@tenet.res.in',
                                      pass: 'Arun@280196'
                                    }
                                  });
                                  
                                  const mailOptions = {
                                    from: 'arun.kumar@tenet.res.in',
                                    to: 'faheera@respark.iitm.ac.in',
                                    subject: 'Peak Demand Limit-level 2 breach',
                                    html: `<h5>Peak Demand Limit-level 2 breach</h5>
                                    
                                    <h5 >Warning:-Peak Demand has crossed limit of ${Math.round(response[i].totalApparentPower2)} KVA at ${localTimeString}</h5>
                                    <h5> Severity:- Medium</h5>
                                    
                                    `
                                  };
                                  //energyteam@respark.iitm.ac.in
                                  //faheera@respark.iitm.ac.in
                                  
                                  transporter.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                       res.send(`Peak Demand has crossed limit of ${response[i].totalApparentPower2} KVA at ${localTimeString}`);
                                    }
                                  });

                        }

                        else if(response[i].totalApparentPower2>=4500){
                            const date = new Date(response[i].polledTime)
                            const localTimeString = date.toLocaleString();
                            const transporter = nodemailer.createTransport({
                                    host: 'smtp.office365.com',
                                    port: 587,
                                    secure: false,
                                    auth: {
                                      user: 'arun.kumar@tenet.res.in',
                                      pass: password
                                    }
                                  });
                                  
                                  const mailOptions = {
                                    from: 'arun.kumar@tenet.res.in',
                                    to: 'faheera@respark.iitm.ac.in',
                                    subject: 'Peak Demand Limit-level 3 breach',
                                    html: `<h5>Peak Demand Limit-level 3 breach</h5>
                                    
                                    <h5 >Warning:-Peak Demand has crossed limit of ${Math.round(response[i].totalApparentPower2)} KVA at ${localTimeString}</h5>
                                    <h5> Severity:- Medium</h5>
                                    
                                    `
                                  };
                                  //energyteam@respark.iitm.ac.in
                                  //faheera@respark.iitm.ac.in
                                  
                                  transporter.sendMail(mailOptions, function(error, info) {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                       res.send(`Peak Demand has crossed limit of ${response[i].totalApparentPower2} KVA at ${localTimeString}`);
                                    }
                                  });

                        }
                       
                    }

                    //console.log(response.length)
                }
            })
            
        })

// ----------------------------------------------------------------------------------------------------------------------------------------

        // thermal api
        app.get("/thermal", (req,res)=>{
            // let c = 0
            // let chk = 0
            // const timarr = []
            // var output = []
            var output = {"0":{chillerEnergy: 0},"1":{chillerEnergy: 0},"2":{chillerEnergy: 0},"3":{chillerEnergy: 0},"4":{chillerEnergy: 0},"5":{chillerEnergy: 0},"6":{chillerEnergy: 0},"7":{chillerEnergy: 0},"8":{chillerEnergy: 0},"9":{chillerEnergy: 0},"10":{chillerEnergy: 0},"11":{chillerEnergy: 0},"12":{chillerEnergy: 0},"13":{chillerEnergy: 0},"14":{chillerEnergy: 0},"15":{chillerEnergy: 0},"16":{chillerEnergy: 0},"17":{chillerEnergy: 0},"18":{chillerEnergy: 0},"19":{chillerEnergy: 0},"20":{chillerEnergy: 0},"21":{chillerEnergy: 0},"22":{chillerEnergy: 0},"23":{chillerEnergy: 0}}

            con.query(`select coolingEnergy,timeInHour from ThermalStorageProcessed where DATE(recordTime) = curdate()`,function(err,result){
                if(err){
                    console.log(err)
                }else{
                    for (const res of result){
                        output[res.timeInHour] = {"chillerEnergy":res.coolingEnergy}
                    }
                }
                res.send(output)
            })

        })

        
        // thermal Temp api
        app.get("/thermaltemp", (req,res)=>{
            unprocesseddata.query(`select tsStoredWaterTemperature from bmsmgmtprodv13.thermalStorageMQTTReadings where Date(polledTime) = curdate() order by polledTime desc LIMIT 1;`,function(err,querres){
                let tempera = 0
                if(err){
                    console.log(err)
                }else{
                    temp = JSON.parse(JSON.stringify(querres))
                    for (const tempdata of temp){
                        // console.log("temp : ",tempdata.tsStoredWaterTemperature/100)
                        tempera = (tempdata.tsStoredWaterTemperature/100)
                    }
                    res.send(tempera.toFixed(1))
                }
            })
           
        })


// ----------------------------------------------------------------------------------------------------------------------------------

        // rooftop
        app.get("/rooftop",(req,res)=>{
            var rooftop = 0 
            con.query(`select acEnergy from RooftopProcessed where polledDate = curdate()`,function(err,qrres){
                if(err){
                    console.log(err)
                }else{
                    for (const result of qrres){
                        rooftop = result["acEnergy"]
                    }
                }
                res.send([rooftop])
                console.log(rooftop)
            })
        })


//Thermal alert api
let k = 0
let criticaltemp = 14
app.get("/thermalalert",(req,res)=>{
    unprocesseddata.query(`select polledTime,tsStoredWaterTemperature/100 as tsStored,tsOutletBDPvalveStatus,tsOutletADPvalveStatus,HValve from thermalStorageMQTTReadings where Date(polledTime)=curdate() order by polledTime;`,function(err,queryres){
        if(err){
            console.log(err)
        }
        else{
            data = JSON.parse(JSON.stringify(queryres))

            for (let i=0; i<data.length;i++){
                const polledtime = data[i].polledTime
                const time = moment.tz(polledtime, tz).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                const timeinmin = time.substring(11,16)
                const date= new Date(polledtime)
                const local=date.toLocaleString()
                const timar = local.split(',')
                const storedwatertemp = data[i].tsStored
                const outBDP = data[i].tsOutletBDPvalveStatus
                const outADP = data[i].tsOutletADPvalveStatus
                const hvalve = data[i].HValve
                const timestamp = new Date(time)
                var curr = new Date(Date.now())
                var currenttime = new Date(moment.tz(curr, tz).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'))
                // const
                

                const transporter = nodemailer.createTransport({
                    host: 'smtp.office365.com',
                    port: 587,
                    secure: false,
                    auth: {
                      user: 'ganeshr@tenet.res.in',
                      pass: password
                    }
                  })
                  

                // console.log(storedwatertemp,outADP,outBDP,hvalve,time)


                 // to get values after 12:10 am
                if (timeinmin>"00:10") {
                     // Checking the temperature after the ts valves have been shut down immediately
                    if ((data[i].tsOutletBDPvalveStatus == 0 && data[i].tsOutletADPvalveStatus == 0 && data[i].HValve == 0) &&
                        (data[i-6].tsOutletBDPvalveStatus == 1 && data[i-6].tsOutletADPvalveStatus == 1 && data[i-6].HValve == 1) ){
                            if (data[i].tsStored < criticaltemp){
                                k=k +1
                            }
                            if (k===5){
                                    k = 0
                                    // console.log("Alert Name : ","Thermal Storage turned off prior to temperature limit")
                                    // console.log("Message : ","Thermal Storage temperature needs to reach 14°C to be turned off.")
                                    // console.log("Temperature is",storedwatertemp+"°C since",time)
                                    const mailOptions = {
                                        from: 'ganeshr@tenet.res.in',
                                        to: 'ganeshkalyan506@gmail.com',
                                        //'abhishek@respark.iitm.ac.in' ,'anson@respark.iitm.ac.in','faheera@respark.iitm.ac.in','arun.kumar@tenet.res.in'
                                        subject: 'Thermal Storage turned off prior to temperature limit',
                                        html: `<h1>Thermal Storage temperature needs to reach 14°C to be turned off.</h1>
                                               <h2>Temperature is ${storedwatertemp}°C since ${timar[1]}</h2> `
                                      }
                                // Condition check to send mail only till the 15th minute after occurence
                                   if((Math.abs(currenttime-timestamp)/1000/60)<15){
                                        transporter.sendMail(mailOptions, function(error, info) {
                                            if (error) {
                                            console.log(error);
                                            } else {
                                                console.log("Temperature is",storedwatertemp+"°C since",timar[1])
                                                res.send(`Temperature is ${storedwatertemp}°C since ${timar[1]}`)
                                            }
                                        })
                            }
                                    
                            }
                    }
                }
            }
        }
    })
})




app.get("/outletTemparature",async(req,res)=>{
    
    chakradb.query("select * from hvacChillerCoolingPolling WHERE polledTime >= CURDATE() AND polledTime < DATE_ADD(CURDATE(), INTERVAL 1 DAY)",function(err,result,feilds){
        if(err){
            console.log(err)
        }
        else{
            const transporter = nodemailer.createTransport({
                host: 'smtp.office365.com',
                port: 587,
                secure: false,
                auth: {
                  user: 'arun.kumar@tenet.res.in',
                  pass: password
                }
              })
            
            const response=(JSON.parse(JSON.stringify(result)))
            let counter=0
            for(let i=0;i<response.length;i++){
                const outletTemp=response[i].commonHeaderoutletTemp+8
                const date=new Date(response[i].polledTime)
                const localtime=date.toLocaleString()
                if((response[i].commonHeaderoutletTemp>=5 && response[i].commonHeaderoutletTemp<=10) && (response[i].commonHeaderinletTemp>outletTemp)){
                    counter+=1
                    //console.log(`common header outlet temparature as limited 10°C ${response[i].commonHeaderinletTemp}... ${outletTemp} at ${localtime}`)
                    
                    //console.log(`the consicutive count is ${counter} and time ${localtime}`)
                }

                

                else{
                    counter=0

                }
                //condition for consicutive 5min than trigger the alert
                if(counter===5){
                    counter=0
                    const mailOptions = {
                        from: 'arun.kumar@tenet.res.in',
                        to:'ganeshkalyan506@gmail.com',
                        //'abhishek@respark.iitm.ac.in' ,'anson@respark.iitm.ac.in','faheera@respark.iitm.ac.in','sandhyaravikumar@tenet.res.in','arun.kumar@tenet.res.in'
                        subject: 'Common Header Outlet Temparature breach',
                        html: `<h1>Common Header Outlet Temparature limit has crossed 10°C</h1>
                               <h2>Current inlet Temparature is ${(response[i].commonHeaderinletTemp).toFixed(2)}°C since ${localtime}</h2>
                               <h2>Current outlet Temparature is ${(response[i].commonHeaderoutletTemp).toFixed(2)}°C since ${localtime}</h2> `
                      }
                      transporter.sendMail(mailOptions, function(error, info) {
                        if (error) {
                          console.log(error);
                        } else {
                            console.log(`Temperature is",${response[i].commonHeaderinletTemp}"°C since ${localtime}`)
                            res.send(`Common Headrer Outlet ${outletTemp} Temparature limit has crossed 10°C since ${localtime}`)
                        }
                      })
                   
                }
                
            }
            
            
        }

        
    })
    
})


 //controlls post request
 app.post('/controlls', function (req, res) {
    const now = new Date();
const formattedDate = now.toLocaleString('en-US', { 
  year: 'numeric', 
  month: '2-digit', 
  day: '2-digit', 
  hour: '2-digit', 
  minute: '2-digit', 
  second: '2-digit', 
  hour12: false
}).replace(',', '');
console.log(formattedDate);

    const { functioncode, starttime,endtime,capacity } = req.body;
    console.log(req.body.functioncode)
    const sql = 'INSERT INTO EMSUPSbatterycontrol (functioncode, starttime,endtime,capacity) VALUES (?, ?, ?, ?)';
    con.query(sql, [functioncode, starttime,endtime,capacity], function (error, results, fields) {
        if (error) {
            return res.status(500).send(error);
        }
        else{
            console.log(results)
            res.status(200).send('parameter  added successfully!');
        }
        //return 
    });
});



app.post('/instantaneous', function (req, res) {



    const { functioncode,batterystatus} = req.body;
    console.log(req.body.functioncode)
    const sql = 'INSERT INTO instantaneous_ups (functioncode,batterystatus) VALUES (?,?)';
    con.query(sql, [functioncode,batterystatus], function (error, results, fields) {
        if (error) {
            return res.status(500).send(error);
        }
        else{
            console.log(results)
            res.status(200).send('parameter  added successfully!');
        }
        //return 
    });
});



app.get("/acknowledment",async(req,res)=>{
    con.query("select * from acknowlegment order by id desc ",function(err,result,feilds){
        if(err){
            console.log(err)
        }
        else{
            const response=(JSON.parse(JSON.stringify(result)))
            res.send(response)
            console.log(response.length)
        }
    })
    
})










app.listen(5000,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("running on port number 3000")
    }
})








/*----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/





// let valuesc = []
//         let valuesd = []
        
        
        
//         const resultarr=[]
        
//             // app.get("/thermal",async(res,req) => {
//             //     res.send(result)
//             // })
//         let datas = {}
//         // Function to get the values from the target database table (hvacChillerCoolingPolling and hvacCpmPolling)
//         // app.get("/thermal", (req,res)=>{
//             let c = 0
//             let chk = 0
//             const timarr = []
//             // var output = []
//             var output = {"0":{chillerEnergy: 0},"1":{chillerEnergy: 0},"2":{chillerEnergy: 0},"3":{chillerEnergy: 0},"4":{chillerEnergy: 0},"5":{chillerEnergy: 0},"6":{chillerEnergy: 0},"7":{chillerEnergy: 0},"8":{chillerEnergy: 0},"9":{chillerEnergy: 0},"10":{chillerEnergy: 0},"11":{chillerEnergy: 0},"12":{chillerEnergy: 0},"13":{chillerEnergy: 0},"14":{chillerEnergy: 0},"15":{chillerEnergy: 0},"16":{chillerEnergy: 0},"17":{chillerEnergy: 0},"18":{chillerEnergy: 0},"19":{chillerEnergy: 0},"20":{chillerEnergy: 0},"21":{chillerEnergy: 0},"22":{chillerEnergy: 0},"23":{chillerEnergy: 0}}

            
            
//             // respfunc = (key, energy)=>{
//             //     // console.log(key,energy)
//             //     output[key] = { chillerEnergy: energy }
//             //     timarr.push(output[key])
//             //     // res.send(output)
//             // }
//             // console.log(timarr)
//             // To get arranged data in hour format and calculates the average per hour and pushes the value into the values array 
//             const formatChargeData = (obj) => {
                
//                     // let output = {}
//                     // Loop through each timings in the input object
//                     for (const key in obj) {
//                     // Calculate the average chillerEnergy for the time
//                     const chillerEnergy = obj[key].chillerEnergy;
//                     const avgChillerEnergy = (chillerEnergy.reduce((a, b) => a + b) / chillerEnergy.length)/1000; // Converting Watts to kW
                    
//                     // respfunc(key,avgChillerEnergy)
//                     // Add the time and its average chillerEnergy to the output object
//                     output[key] = { chillerEnergy: avgChillerEnergy };
//                     // console.log(output)
//                     // res.send(output)
//                 }
//         //console.log(output)
//         }
//                 // console.log(result)0.
        
//                 // To group the data by hour and get the data in desired format. This function calls formatData() function
//                 // const cleanData = (arr) => {  
//                 //     const groupedByHour = arr.reduce((acc, obj) => {
//                 //     const hour = new Date(obj.timestamp).getUTCHours();
//                 //       if (!acc[hour]) {
//                 //       acc[hour] = [];
//                 //       }
//                 //       acc[hour].push(obj);
//                 //       return acc;
//                 //       }, {});
//                 //       formatData(groupedByHour)
//                 //     }
        
                   
//                     const cleanChargeData = (data)=>{
//                         let result = {};
//                         for (let i = 0; i < data.length; i++) {
//                         let timestamp = new Date(data[i].timestamp);
//                         let hour = timestamp.getUTCHours();
        
//                         if (!result[hour]) {
//                             result[hour] = {
//                             chillerEnergy: []
//                             };
//                         }
//                         result[hour].chillerEnergy.push(data[i].chillerEnergy);
//                         }
//                         // console.log(result)
//                         formatChargeData(result)
//                     }
        
//                     // To calculate the cumulative value of the chiller Energy and calls the function cleanData(chillerEnergy)
//                     let tempchargearr = [0]
//                     const cummulativeValueCharge = (chillerEnergy,time) => {
//                         Energy = Math.abs(tempchargearr.slice(-1)[0]-chillerEnergy)
//                         tempchargearr.push(chillerEnergy)
//                         // temparr = temparr.shift()
//                         // console.log(chillerEnergy,Energy)
//                         if (chillerEnergy != Energy){
//                             valuesc.push({"chillerEnergy":Energy,"timestamp":time})
//                         }
//                     }
        
//                     cleanChargeData(valuesc)
        
        
//             //Inner join query to get the coresponding value from two tables in  bmsmgmt_olap_prod_v13 database based on recordId
        
//             // SQL query to get chiller inlet and outlet , storage tank inlet and outlet from hvacCmpPolling table joined with (inner join) 
//             // hvacChillerCoolingPolling getting chiller energy.
        
//                     chakradb.query(`select hvacCpmPolling.recordId,
//                                     hvacCpmPolling.chillerInletValve1Status,hvacCpmPolling.chillerInletValve2Status,hvacCpmPolling.chillerInletValve3Status,hvacCpmPolling.chillerInletValve4Status,
//                                     hvacCpmPolling.chillerOutletValve1Status,hvacCpmPolling.chillerOutletValve2Status,hvacCpmPolling.chillerOutletValve3Status,hvacCpmPolling.chillerOutletValve4Status,
//                                     hvacCpmPolling.storageTankInletValve1Status,hvacCpmPolling.storageTankInletValve2Status,hvacCpmPolling.storageTankInletValve3Status,hvacCpmPolling.storageTankInletValve4Status,
//                                     hvacCpmPolling.storageTankOutletValve1Status,hvacCpmPolling.storageTankOutletValve2Status,hvacCpmPolling.storageTankOutletValve3Status,hvacCpmPolling.storageTankOutletValve4Status,
//                                     hvacChillerCoolingPolling.chiller1Energy,hvacChillerCoolingPolling.chiller2Energy,hvacChillerCoolingPolling.chiller3Energy,hvacChillerCoolingPolling.chiller4Energy, hvacCpmPolling.polledTime from bmsmgmt_olap_prod_v13.hvacCpmPolling inner join bmsmgmt_olap_prod_v13.hvacChillerCoolingPolling on hvacCpmPolling.polledTime = hvacChillerCoolingPolling.polledTime where Date (hvacCpmPolling.polledTime) = curdate() order by hvacChillerCoolingPolling.polledTime asc;`,function(err,queryres){
//                         if(err){
//                             console.log(err)
//                         }
//                         else{
//                             // parsing the query output into json
//                             data = JSON.parse(JSON.stringify(queryres))
//                             // console.log(datas)
//                             for (let i=0; i<data.length;i++) {
        
//                                 const recid = data[i].recordId
//                                 const ci1 = data[i].chillerInletValve1Status
//                                 const ci2 = data[i].chillerInletValve2Status
//                                 const ci3 = data[i].chillerInletValve3Status
//                                 const ci4 = data[i].chillerInletValve4Status
//                                 const co1 = data[i].chillerOutletValve1Status
//                                 const co2 = data[i].chillerOutletValve2Status
//                                 const co3 = data[i].chillerOutletValve3Status
//                                 const co4 = data[i].chillerOutletValve4Status
//                                 const si1 = data[i].storageTankInletValve1Status
//                                 const si2 = data[i].storageTankInletValve2Status
//                                 const si3 = data[i].storageTankInletValve3Status
//                                 const si4 = data[i].storageTankInletValve4Status
//                                 const so1 = data[i].storageTankOutletValve1Status
//                                 const so2 = data[i].storageTankOutletValve2Status
//                                 const so3 = data[i].storageTankOutletValve3Status
//                                 const so4 = data[i].storageTankOutletValve4Status
//                                 const corsptime = data[i].polledTime
//                                 const parsedTime = moment.tz(corsptime, tz).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
//                                 const che1 = data[i].chiller1Energy
//                                 const che2 = data[i].chiller2Energy
//                                 const che3 = data[i].chiller3Energy
//                                 const che4 = data[i].chiller4Energy
                        
//                                 // console.log(recid)
                                
//                                 // Checking the charging status of the chillers based on the inlet and outlet valve
        
//                                     if ((ci1 == 0 && co1 == 0) && (si1 == 1 && so1 == 1)) {
//                                         // console.log("Chiller 1 Charging","Chiller Energy : ",che1,parsedTime)
//                                         if(che1 !=null){
//                                             cummulativeValueCharge(che1,parsedTime)
//                                         }
//                                     }
//                                     else if ((ci2 == 0 && co2 == 0) && (si2 ==1 && so2 == 1)) {
//                                         // console.log("Chiller 2 is charging","Chiller Energy : ",che2,parsedTime)
//                                         if(che2 !=null){
//                                             cummulativeValueCharge(che2,parsedTime)
//                                         }
//                                     }
//                                     else if ((ci3 == 0 && co3 == 0) && (si3 ==1 && so3 == 1)) {
//                                         // console.log("Chiller 3 is charging","Chiller Energy : ",che3,parsedTime)
//                                         if(che3 !=null){
//                                             cummulativeValueCharge(che3,parsedTime)
//                                         }
//                                     }
//                                     else if ((ci4 == 0 && co4 == 0) && (si4 ==1 && so4 == 1)) {
//                                         // console.log("Chiller 4 is charging","Chiller Energy : ",che4,parsedTime)
//                                         if(che4 !=null){
//                                             cummulativeValueCharge(che4,parsedTime)
//                                         }
//                                     }
//                                     // else{
//                                     //     console.log("Chillers not charging")
//                                     // }
//                                 }
//                         }
//                     })
        
//                     const formatDischargeData = (obj) => {
//                         //var output=[]
//                         // Loop through each timings in the input object
//                         // console.log(obj)
//                         for (const key in obj) {
//                         // Calculate the average chillerEnergy for the time
//                         const chillerEnergy = obj[key].chillerEnergy;
//                         const avgChillerEnergy = -Math.abs((chillerEnergy.reduce((a, b) => a + b))); // Converting Watts to kW
                        
//                         // console.log("energy : ",avgChillerEnergy)
//                         // respfunc(key,avgChillerEnergy,chkno)
//                         // Add the time and its average chillerEnergy to the output object
//                         output[key] = { chillerEnergy: avgChillerEnergy };
//                         // output.push({ "chillerEnergy": avgChillerEnergy,"time":key});
//                         // console.log(output)
//                         // console.log(output)
//                              }
//                      }
        
//                 const cleanDischargeData = (data)=>{
//                     let result = {};
//                     for (let i = 0; i < data.length; i++) {
//                     let timestamp = new Date(data[i].timestamp);
//                     let hour = timestamp.getUTCHours();
        
//                     if (!result[hour]) {
//                         result[hour] = {
//                         chillerEnergy: []
//                         };
//                     }
//                     result[hour].chillerEnergy.push(data[i].chillerEnergy);
//                     }
//                     // console.log("length : ",result['7'].chillerEnergy.length)
//                     formatDischargeData(result)
//                 }
        
//                 let tempdischargearr = [0]
//                 cummulativeValueDischarge = (chillerEnergy,time,chkno) => {
//                     Energy = Math.abs(tempdischargearr.slice(-1)[0]-chillerEnergy)
//                     tempdischargearr.push(chillerEnergy)
//                     // temparr = temparr.shift()
//                     // console.log(chillerEnergy,Energy)
//                     if (chillerEnergy != Energy){
//                         // console.log(valuesd.length,chkno-2)
//                         if(valuesd.length == (chkno -2)){
//                             // console.log(valuesd)
//                             cleanDischargeData(valuesd)
//                             valuesd = []
//                             // console.log(valuesd.length)
//                         }
//                         else{
//                         valuesd.push({"chillerEnergy":Energy,"timestamp":time})
//                         }
//                 }
//                     // console.log(valuesd.length,chkno-1)
//                     // console.log(valuesd)
//                     // console.log("values len : ",valuesd.length)
//                     // cleanDischargeData(valuesd)
//                 }
                
                
//                 unprocesseddata.query(`select polledTime,coolingEnergyConsumption,tsStoredWaterTemperature,tsOutletBDPvalveStatus,tsOutletADPvalveStatus,HValve from thermalStorageMQTTReadings where Date(polledTime)= curdate() and tsOutletADPvalveStatus = 1 and tsOutletBDPvalveStatus = 1 and HValve = 1 order by polledTime asc ;`,function(err,queryres){
//                     if(err){
//                         console.log(err)
//                     }
//                     else{
//                         // parsing the query output into json

//                         data = JSON.parse(JSON.stringify(queryres))
//                         chk = data.length
//                         for (const datum of data){
//                             const coolenergy = datum.coolingEnergyConsumption
//                             const polledtime = datum.polledTime
//                             const parsedTime = moment.tz(polledtime, tz).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
                            
//                             // console.log(coolenergy/100,parsedTime)

//                             cummulativeValueDischarge(coolenergy/100,parsedTime,chk)
//                         }
//                         // res.send(output)
//                     }
//                 })
//             //console.log(output)
            
//         // })
