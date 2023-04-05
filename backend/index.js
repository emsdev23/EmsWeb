const express=require('express')
const {con,chakradb,unprocesseddata}=require('./connect')
const app=express()
const cors = require("cors");
const nodemailer = require('nodemailer');

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

        minresult.push({'chargingAVG':chargingEnergyAvg,"dischargingAVG":dischargingenergy,"batteryStatus":batterystaus,"timestamp":timestamp,"pack_usable_soc":packSoc})
    }
  });

  









  
  const finalresult=[]
  for (let i = 1; i < minresult.length; i++) {
    const current = minresult[i];
    const previous = minresult[i - 1];
    const chargingDiff = current.chargingAVG - previous.chargingAVG;
    const dischargingDiff = current.dischargingAVG - previous.dischargingAVG;
    const timestamp=minresult[i].timestamp
    const packSocVal=minresult[i].pack_usable_soc
    const batteryStatus=minresult[i].batteryStatus
    finalresult.push({'chargingEnergy':chargingDiff,'dischargingEnergy':dischargingDiff,"timestamp":timestamp,"pack_usable_soc":packSocVal,"batteryStatus":batteryStatus})
    // console.log(`Charging difference: ${chargingDiff}`);
    // console.log(`Discharging difference: ${dischargingDiff}`);
  }
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
    unprocesseddata.query("show tables",function(err,result,feilds){
            if(err){
                console.log(err)
            }
            else{
                // const response=(JSON.parse(JSON.stringify(result)))
                // res.send(response)
                console.log(result)
            }
        })



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
            chakradb.query("select * from hvacSchneider7230Polling WHERE polledTime >= CURDATE() AND polledTime < DATE_ADD(CURDATE(), INTERVAL 1 DAY)",function(err,result,feilds){
                if(err){
                    console.log(err)
                }
                else{
                    const response=(JSON.parse(JSON.stringify(result)))
                    //res.send(response)
                    for(let i=0;i<response.length;i++){
                        if(response[i].totalApparentPower2>=4000){
                            const date = new Date(response[i].polledTime)
                            const localTimeString = date.toLocaleString();
                            const transporter = nodemailer.createTransport({
                                    host: 'smtp.office365.com',
                                    port: 587,
                                    secure: false,
                                    auth: {
                                      user: 'ganeshr@tenet.res.in',
                                      pass: 'Ganesh3110#'
                                    }
                                  });
                                  
                                  const mailOptions = {
                                    from: 'ganeshr@tenet.res.in',
                                    to: 'ganeshkalyan506@gmail.com',
                                    subject: 'Test email',
                                    html: `<h1 >Warning:-Peak Demand has crossed limit of ${response[i].totalApparentPower2} KVA at ${localTimeString}</h1>`
                                  };
                                  
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


        

        
          


        

        



app.listen(5000,(err)=>{
    if(err){
        console.log(err)
    }
    else{
        console.log("running on port number 3000")
    }
})


