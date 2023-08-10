const express=require('express')
const timeout = require('connect-timeout')
const {con,chakradb,unprocesseddata,hashtic,meterDb}=require('./connect')
const app=express()
const alert = express()
const cors = require("cors");
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const tz = 'Asia/Kolkata'
const password = "Arun@1807"
const email = 'arun.kumar@tenet.res.in'
const emailto =['ems@respark.iitm.ac.in']
//faheera@respark.iitm.ac.in


alert.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );

alert.use(express.json());

alert.use(timeout('40s'))

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

  app.get("/Batterydata",async(req,res)=>{
    const finalresultValue=[]
    con.query("select * from EMSUPSbattery where date(received_time)=curdate();",function(err,result,feilds){
      if(err){
        console.log(err)
      }
      else{
        const response=(JSON.parse(JSON.stringify(result)))
        for(let i=0;i<response.length;i++){
          const date = new Date(response[i].received_time)
          const localTimeString = date.toLocaleString();
          finalresultValue.push({'chargingAVG':response[i].upschargingenergy,"dischargingAVG":response[i].negative_energy,"batteryStatus":response[i].upsbatterystatus,"timestamp":localTimeString,"pack_usable_soc":response[i].packsoc})

        }
        res.send(finalresultValue)
        console.log(finalresultValue.length)
      }

    })
   
  })



    //---------------------------battery Dashboard--------------------//
    app.get("/dashboard/Battery",async(req,res)=>{
      const resultValue=[]
      meterDb.query("select * from meterdata.batteryhourly where date(received_time) = curdate();",function(err,result,feilds){
       // DATE_SUB(CURDATE(), INTERVAL 1 DAY)  
        if(err){
              console.log(err)
          }
          else{
              const response=(JSON.parse(JSON.stringify(result)))
              for(let i=0;i<response.length;i++){
                let date = new Date(response[i].received_time);
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                // const seconds = date.getSeconds().toString().padStart(2, '0');
                const timestamp = `${hours}:${minutes}`;
                resultValue.push({"PolledTime":timestamp,"chargingEnergy":parseFloat(response[i].total_upschargingenergy_diff),"dischargingEnergy":parseFloat(response[i].total_upsdidchargingenergy_diff)*-1,"idleEnergy":parseFloat(response[i].idle_energystatues),"Pacsoc":parseInt(response[i].max_pacsoc),"energy_available":response[i].energy_available})

              }
              res.send(resultValue)
              console.log(resultValue.length)
          }
      })
      
  })



    //-----------------------end of api---------------------//

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
      meterDb.query("select cumulative_energy,polled_timestamp from gridenergytoday where date(polled_timestamp)=curdate() order by polled_timestamp desc limit 1;",function(err,result,feilds){
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

    app.get("/Buildingconsumption/grid",async(req,res)=>{
      const resultValue=[]
      meterDb.query("select cumulative_energy,timestamp from gridenergyhourly where date(timestamp)=curdate() ",function(err,result,feilds){
             if(err){
                 console.log(err)
             }
             else{
                 const response=(JSON.parse(JSON.stringify(result)))
                 for(let i=0;i<response.length;i++){
                  let date = new Date(response[i].timestamp);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              // const seconds = date.getSeconds().toString().padStart(2, '0');
              const timestampVal = `${hours}:${minutes}`;
              resultValue.push({"polledTime":timestampVal,"cumulative_energy":parseFloat(response[i].cumulative_energy)})

                 }
                 res.send(resultValue)
                 console.log(response.length)
             }
         })

 
        
    })

    app.get('/BuildingConsumptionPage2',async(req,res)=>{
      const finalValue=[]
      con.query("SELECT Gridhourly.Energy as GridEnergy, UPSbatteryHourly.polledTime as timestamp , UPSbatteryHourly.discharhingEnergy as BatteryDischarEnergy, UPSbatteryHourly.chargingEnergy as BatteryChargeEnergy,Wheeledhourly.Energy as WheeledEnergy,rooftopHourly.Energy as RooftopEnergy FROM Gridhourly JOIN UPSbatteryHourly ON Gridhourly.polledTime = UPSbatteryHourly.polledTime  JOIN Wheeledhourly ON Wheeledhourly.polledTime=Gridhourly.polledTime JOIN rooftopHourly on rooftopHourly.polledTime=Gridhourly.polledTime  where date(UPSbatteryHourly.polledTime)=CURDATE();",function(err,result,feilds){
        //DATE_SUB(CURDATE(), INTERVAL 1 DAY)
        
        //SELECT Gridhourly.Energy as GridEnergy, Gridhourly.polledTime as timestamp, rooftopHourly.energy as RooftopEnergy , UPSbatteryHourly.discharhingEnergy as BatteryDischarEnergy, chargingEnergy as BatteryChargeEnergy,Wheeledhourly.Energy as WheeledEnergy FROM Gridhourly JOIN rooftopHourly ON Gridhourly.polledTime = rooftopHourly.polledTime JOIN UPSbatteryHourly ON rooftopHourly.polledTime = UPSbatteryHourly.polledTime JOIN Wheeledhourly ON Wheeledhourly.polledTime=rooftopHourly.polledTime  where date(Gridhourly.polledTime)=CURDATE();
        if(err){
          console.log(err)
        }
        else{
          const response=(JSON.parse(JSON.stringify(result)))
          for(let i=0;i<response.length;i++){
            let date = new Date(response[i].timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            // const seconds = date.getSeconds().toString().padStart(2, '0');
            const timestampVal = `${hours}:${minutes}`;
            finalValue.push({"Timestamp":timestampVal,"GridEnergy":Math.trunc(response[i].GridEnergy),"RooftopEnergy":Math.trunc(response[i].RooftopEnergy),"BatteryDischarEnergy":response[i].BatteryDischarEnergy,"BatteryChargeEnergy":response[i].BatteryChargeEnergy,"WheeledInSolar":response[i].WheeledEnergy})
            
          }
          res.send(finalValue)
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

        

// ----------------------------------------------------------------------------------------------------------------------------------------

        // thermal api
        app.get("/thermal", (req,res)=>{
            // let c = 0
            // let chk = 0
            // const timarr = []
            // var output = []
            con.query(`select coolingEnergy,timeInHour from ThermalStorageProcessed where DATE(recordTime) = curdate()`,function(err,result){
                var output = {"0":{chillerEnergy: 0},"1":{chillerEnergy: 0},"2":{chillerEnergy: 0},"3":{chillerEnergy: 0},"4":{chillerEnergy: 0},"5":{chillerEnergy: 0},"6":{chillerEnergy: 0},"7":{chillerEnergy: 0},"8":{chillerEnergy: 0},"9":{chillerEnergy: 0},"10":{chillerEnergy: 0},"11":{chillerEnergy: 0},"12":{chillerEnergy: 0},"13":{chillerEnergy: 0},"14":{chillerEnergy: 0},"15":{chillerEnergy: 0},"16":{chillerEnergy: 0},"17":{chillerEnergy: 0},"18":{chillerEnergy: 0},"19":{chillerEnergy: 0},"20":{chillerEnergy: 0},"21":{chillerEnergy: 0},"22":{chillerEnergy: 0},"23":{chillerEnergy: 0}}
                if(err){
                    console.log(err)
                }else{
                    for (const res of result){
                        output[res.timeInHour] = {"chillerEnergy":res.coolingEnergy}
                    }
                }
                console.log(output)
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
            meterDb.query("select cumulative_energy,polled_timestamp from meterdata.rooftopreadingtoday where Date(polled_timestamp)=curdate() order by polled_timestamp desc limit 1;",function(err,qrres){
                if(err){
                    console.log(err)
                }else{
                    for (const result of qrres){
                        rooftop = result["cumulative_energy"]
                    }
                }
                res.send([rooftop])
                console.log(rooftop)
            })
        })


//------------------------------------------------------------------------------------------------------------------------------------
    
        // Peak shavings
        app.get('/peaksavings',(req,res)=>{
            con.query(`select Energysaved from energySaved where date(polledTime) = curdate()`,function(err,qres){
                var energysaved = 0
                if(err){
                    console.log(err)
                }else{
                    for (const result of qres){
                        energysaved = result["Energysaved"]
                    }
                console.log("Energysaved ",energysaved)
                res.send([energysaved])
                }
            })
        })

//--------------------------------------------------------------------------------------------------------------------------------------

            // Chiller status
        
            app.get("/chillerstatusd",(req,res)=>{
                chakradb.query(`select chiller1Power,chiller2Power,chiller3Power,chiller4Power,polledTime from hvacChillerElectricPolling order by polledTime desc LIMIT 1`,function(err,qres){
                    if(err){
                        console.log(err)
                    }else{
                        outli = []
                        for(const out of qres){
                            outli.push(out["chiller1Power"])
                            outli.push(out["chiller2Power"])
                            outli.push(out["chiller3Power"])
                            outli.push(out["chiller4Power"])
                        }
                        res.send(outli)
                    }
                })
            })

            app.get("/chillerstatuse",(req,res)=>{
                unprocesseddata.query(`select FLOOR(acmeterenergy),acmeterpower,acmeterpolledtimestamp,acmetersubsystemid from acmeterreadings where acmetersubsystemid in(1442,1163,1441,1494) order by acmeterpolledtimestamp desc limit 4;`,function(err,qres){
                    if(err){
                        console.log(err)
                    }else{
                        outl = {}
                        for(const out of qres){
                            if (out["acmetersubsystemid"] == 1442){
                                outl['chiller5']=out['acmeterpower']
                            }
                            else if (out["acmetersubsystemid"] == 1163){
                                outl['chiller6']=out['acmeterpower']
                            }
                            else if (out["acmetersubsystemid"] == 1441){
                                outl["chiller7"]=out['acmeterpower']
                            }
                            else if (out["acmetersubsystemid"] == 1494){
                                outl["chiller8"]=out['acmeterpower']
                            }
                        }
                        // console.log(outl)
                        res.send(outl)
                    }
                })
            })
            
            
            
            
//             app.get("/schneider7230readings",async(req,res)=>{
//     meterDb.query("select * from schneider7230readings  where DATE(schneiderpolledtimestamp) = curdate()  order by schneiderpolledtimestamp desc limit 1",function(err,result,feilds){
//         const powerfactor=[]
//         if(err){
//             console.log(err)
//         }
//         else{
//             const response=(JSON.parse(JSON.stringify(result)))
//             for(let i=0;i<response.length;i++){
//             const date = new Date(response[i].schneiderpolledtimestamp);
//             const timestamp = date.toLocaleString();
//             powerfactor.push({"polledTime":timestamp,"average_powerfactor":response[i].average_powerfactor,"minimum_powerfactor":response[i].minimum_powerfactor})
//             }
//             res.send(powerfactor)
//             console.log(powerfactor)
//         }
//     })
   
// })

app.get("/schneider7230readings",async(req,res)=>{
  meterDb.query("select * from schneider7230readings  where DATE(schneiderpolledtimestamp) = curdate()  order by schneiderpolledtimestamp desc limit 1",function(err,result,feilds){
      const powerfactor=[]
      if(err){
          console.log(err)
      }
      else{
          const response=(JSON.parse(JSON.stringify(result)))
          for(let i=0;i<response.length;i++){
          const date = new Date(response[i].schneiderpolledtimestamp);
          const timestamp = date.toLocaleString();
          powerfactor.push({"polledTime":timestamp,"average_powerfactor":response[i].average_powerfactor,"minimum_powerfactor":response[i].minimum_powerfactor})
          }
          res.send(powerfactor)
          console.log(powerfactor)
      }
  })
 
})


//------------------ diselenergy api-------------------------//
app.get("/dashboard/Deisel",async(req,res)=>{
    meterDb.query("SELECT * FROM diselenergy where date(polled_time)=curdate() order by polled_time desc limit 1",function(error,result){
        const deiseldata=[]
        if(error){
            console.log(error)
        }
        else{
            const response=(JSON.parse(JSON.stringify(result)))
            console.log(response)
            res.send(response)

        }

    })
})


//--------------------Ev charger card api--------------------//
app.get("/dashboard/EvCharger",async(req,res)=>{
    con.query("select * from evcharger where date(servertime)=curdate();",function(error,result){
        //select * from evcharger where date(servertime)=curdate()
        //SELECT * FROM evcharger WHERE DATE(servertime) = DATE_SUB(CURDATE(), INTERVAL 1 DAY);
        const LEV1_1=[]
        const LEV4_1=[]
        const CP11_1=[]
        const CP12_1=[]
        const CP13_1=[]
        const CP14_1=[]
        const energyValue=[]

        let resultval=0
        if(error){
            console.log(error)
        }
        else{
            const response=(JSON.parse(JSON.stringify(result)))
let LEV1_1= {'LEV1_1Energy':0,'LEV1_1TotalSession':0,'LEV1_1NoOf_chargers':0} 
let LEV4_1= {'LEV4_1Energy':0,'LEV4_1TotalSession':0,'LEV4_NoOf_chargers':0}
let CP11_1= {'CP11_1Energy':0,'CP11_1TotalSession':0,'CP11_1NoOf_chargers':0}
let CP12_1= {'CP12_1Energy':0,'CP12_1TotalSession':0,'CP12_1NoOf_chargers':0}
let CP13_1= {'CP13_11Energy':0,'CP13_1TotalSession':0,'CP13_1NoOf_chargers':0}
let CP14_1= {'CP14_1Energy':0,'CP14_1TotalSession':0,'CP14_1NoOf_chargers':0}


let ActiveChargingpoint=""
let NoOfChargers=0
let previousTimestamp = null;
let totalUsageTime = 0;



for(let i=0;i<response.length;i++){
    
    if(response[i].chargpointname==="LEV1_1"){
        LEV1_1.LEV1_1Energy+=parseFloat(response[i].energyconsumption)
         LEV1_1.LEV1_1TotalSession+=(response[i].totalsessions)
         if(parseFloat(response[i].energyconsumption)>0){
            LEV1_1.LEV1_1NoOf_chargers="Active"
            ActiveChargingpoint=(response[i].chargpointname)
            NoOfChargers+=1
         }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              console.log(response[i].chargpointname)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
         
         
        
        //console.log(LEV1_1,"line number 81")
    }
    if(response[i].chargpointname==="LEV4_1"){
        LEV4_1.LEV4_1Energy+=parseFloat(response[i].energyconsumption)
        LEV4_1.LEV4_1TotalSession+=(response[i].totalsessions)
        if(parseFloat(response[i].energyconsumption)>0){
            LEV4_1.LEV4_NoOf_chargers="Active"
            ActiveChargingpoint=(response[i].chargpointname)
            NoOfChargers+=1
        }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
        
        //console.log(LEV4_1,"line number 85")
    }
    
    if(response[i].chargpointname==="CP11_1"){
        CP11_1.CP11_1Energy+=parseFloat(response[i].energyconsumption)
        CP11_1.CP11_1TotalSession+=(response[i].totalsessions)
        if(parseFloat(response[i].energyconsumption)>0){
            CP11_1.CP11_1NoOf_chargers="Active"
            ActiveChargingpoint=(response[i].chargpointname)
            NoOfChargers+=1
         }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              console.log(response[i].chargpointname)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
        //console.log(LEV4_1,"line number 90")
    }
    if(response[i].chargpointname==="CP12_1"){
        CP12_1.CP12_1Energy+=parseFloat(response[i].energyconsumption)
        CP12_1.CP12_1TotalSession+=(response[i].totalsessions)
        //console.log(LEV4_1,"line number 94")
        if(parseFloat(response[i].energyconsumption)>0){
            CP12_1.CP12_1NoOf_chargers="Active"
            ActiveChargingpoint=(response[i].chargpointname)
            NoOfChargers+=1
         }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              console.log(response[i].chargpointname)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
    }
    if(response[i].chargpointname==="CP13_1"){
        CP13_1.CP13_11Energy+=parseFloat(response[i].energyconsumption)
        CP13_1.CP13_1TotalSession+=(response[i].totalsessions)
        if(parseFloat(response[i].energyconsumption)>0){
            CP13_1.CP13_1NoOf_chargers="Active"
            ActiveChargingpoint=(`${response[i].chargpointname}`)
            NoOfChargers+=1
         }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              console.log(response[i].chargpointname)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
        
       // console.log(LEV4_1,"line number 98")
    }
    if(response[i].chargpointname==="CP14_1"){
        CP14_1.CP14_1Energy+=parseFloat(response[i].energyconsumption)
        CP14_1.CP14_1TotalSession+=(response[i].totalsessions)
        if(parseFloat(response[i].energyconsumption)>0){
            CP14_1.CP14_1NoOf_chargers="Active"
            ActiveChargingpoint=(response[i].chargpointname)
            NoOfChargers+=1
         }
         if (response[i].totalsessions === 1) {
            if (previousTimestamp) {
              const currentTimestamp = new Date(response[i].servertime);
              const timeDifference = currentTimestamp - previousTimestamp;
              console.log(timeDifference)
              console.log(response[i].chargpointname)
              totalUsageTime += timeDifference;
            }
            previousTimestamp = new Date(response[i].servertime);
          }
        //console.log(LEV4_1,"line number 102")
    }
    
}

// let LEV1_1= {'LEV1_1Energy':0,'LEV1_1TotalSession':0,'LEV1_1NoOf_chargers':0} 
// let LEV4_1= {'LEV4_1Energy':0,'LEV4_1TotalSession':0,'LEV4_NoOf_chargers':0}
// let CP11_1= {'CP11_1Energy':0,'CP11_1TotalSession':0,'CP11_1NoOf_chargers':0}
// let CP12_1= {'CP12_1Energy':0,'CP12_1TotalSession':0,'CP12_1NoOf_chargers':0}
// let CP13_1= {'CP13_11Energy':0,'CP13_1TotalSession':0,'CP13_1NoOf_chargers':0}
// let CP14_1= {'CP14_1Energy':0,'CP14_1TotalSession':0,'CP14_1NoOf_chargers':0}
const finalresult=[]
const totalEnergy=(LEV1_1.LEV1_1Energy+LEV4_1.LEV4_1Energy+CP11_1.CP11_1Energy+CP12_1.CP12_1Energy+CP13_1.CP13_11Energy+CP14_1.CP14_1Energy)
const TotalSessions=(LEV1_1.LEV1_1TotalSession+LEV4_1.LEV4_1TotalSession+CP11_1.CP11_1TotalSession+CP12_1.CP12_1TotalSession+CP13_1.CP13_1TotalSession+CP14_1.CP14_1Energy)
//   let LEV1_1=0
//     let LEV4_1=0
//     let CP11_1=0
//     let CP12_1=0
//     let CP13_1=0
//     let CP14_1=0

//console.log(LEV1_1+LEV4_1+CP11_1+CP12_1+CP13_1+CP14_1)
const totalUsageTimeHours = Math.round(totalUsageTime / 3600000);


finalresult.push({"totalEnergy":totalEnergy,"totalSessions":TotalSessions,"NoOfChargersUsed":NoOfChargers,"currentActiveDevice":ActiveChargingpoint,"totalTimeusage":totalUsageTimeHours})
//console.log(LEV1_1.LEV1_1Energy+LEV4_1.LEV4_1Energy+CP12_1.CP12_1Energy+CP13_1.CP13_11Energy+ CP13_1.CP13_11Energy+CP13_1.CP14_1Energy)
            //res.status(200).send( result );
            res.status(200).send( finalresult );
            console.log(finalresult)
            console.log('Total Usage Time (hours):', totalUsageTimeHours);
            //console.log(totalEnergy)

        }

    })
})

//------------------------------battery 5min analystics  ------------------------------//
app.get("/analytics/battery", async (req, res) => {
    meterDb.query("select * from meterdata.batteryfiveminute where date(received_time)=curdate() order by received_time asc", function (error, result) {
      const batteryData = [];
      const energy = [];
      const packsoc = [];
      const timestamp = [];
      const resultData=[]
  
      if (error) {
        console.log(error);
      } else {
        const response = JSON.parse(JSON.stringify(result));
        for (let i = 0; i < response.length; i++) {
          if (response[i].max_pacsoc) {
            if (response[i].upsbatterystatus==="IDLE") {
              energy.push(response[i].idle_energystatues);
              packsoc.push(response[i].max_pacsoc);
              let date = new Date(response[i].received_time);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              // const seconds = date.getSeconds().toString().padStart(2, '0');
              const timestamp = `${hours}:${minutes}`;
              //timestamp.push(date);
              resultData.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":0.01,"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})

            }
            if (response[i].upsbatterystatus==="DCHG") {
              energy.push((response[i].total_upsdidchargingenergy_diff)*-1);
              packsoc.push(response[i].max_pacsoc);
              let date = new Date(response[i].received_time);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              // const seconds = date.getSeconds().toString().padStart(2, '0');
              const timestamp = `${hours}:${minutes}`;
              //timestamp.push(date);
              resultData.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":parseFloat((response[i].total_upsdidchargingenergy_diff)*-1),"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})
            }
            if (response[i].upsbatterystatus==="CHG") {
              energy.push(response[i].total_upschargingenergy_diff);
              packsoc.push(response[i].max_pacsoc);
              let date = new Date(response[i].received_time);
              const hours = date.getHours().toString().padStart(2, '0');
              const minutes = date.getMinutes().toString().padStart(2, '0');
              // const seconds = date.getSeconds().toString().padStart(2, '0');
              const timestamp = `${hours}:${minutes}`;
              //timestamp.push(date);

              resultData.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":parseFloat(response[i].total_upschargingenergy_diff),"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})
            }
          }
        }
  
  
        res.send(resultData);
        console.log(result.length)
      }
    });
  });

//----------------------------------------------------------------------//

//--------------------------------battery voltage vs current graph-------------------------------//
app.get("/analytics/battery/voltage&current", async (req, res) => {
  meterDb.query("select * from batteryoneminute where date(received_time)=curdate() order by received_time asc", function (error, result) {
    const resultData=[]

    if (error) {
      console.log(error);
    } else {
      const response = JSON.parse(JSON.stringify(result));

       for (let i = 0; i < response.length; i++) {
        if(response[i].batteryVoltage){}
        let date = new Date(response[i].received_time);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        // const seconds = date.getSeconds().toString().padStart(2, '0');
        const timestamp = `${hours}:${minutes}`;
        
        resultData.push({"timestamp":timestamp,"batteryVoltage":parseInt(response[i].batteryvoltage),"batteryCurrent":parseFloat(response[i].batterycurrent)})
      }


      res.send(resultData);
      console.log(response.length)
    }
  });
});


//-------------------------------------end of api------------------------------------------//
//-------------------------filtering the battery --------------------------//
//-----------------------filter api for energy vs packsoc-------------------//
app.post("/analytics/fivemingraphs", (req, res) => {
  const { date} = req.body;
  const endResult=[]
  const batteryData = [];
   const energy = [];
   const packsoc = [];
   const timestamp = [];
  const resultData=[]
  const query = `select * from meterdata.batteryfiveminute where date(received_time)='${date}' order by received_time asc`;
  meterDb.query(query, (error, response) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred' });
    }
    for (let i = 0; i < response.length; i++) {
      if (response[i].max_pacsoc) {
        if (response[i].upsbatterystatus==="IDLE") {
          energy.push(response[i].idle_energystatues);
          packsoc.push(response[i].max_pacsoc);
          let date = new Date(response[i].received_time);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          // const seconds = date.getSeconds().toString().padStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          //timestamp.push(date);
          endResult.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":0.01,"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})

        }
        if (response[i].upsbatterystatus==="DCHG") {
          energy.push((response[i].total_upsdidchargingenergy_diff)*-1);
          packsoc.push(response[i].max_pacsoc);
          let date = new Date(response[i].received_time);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          // const seconds = date.getSeconds().toString().padStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          //timestamp.push(date);
          endResult.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":parseFloat((response[i].total_upsdidchargingenergy_diff)*-1),"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})
        }
        if (response[i].upsbatterystatus==="CHG") {
          energy.push(response[i].total_upschargingenergy_diff);
          packsoc.push(response[i].max_pacsoc);
          let date = new Date(response[i].received_time);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          // const seconds = date.getSeconds().toString().padStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          //timestamp.push(date);

          endResult.push({"packsoc":parseInt(response[i].max_pacsoc),"batteryEnergy":parseFloat(response[i].total_upschargingenergy_diff),"timestamp":timestamp,"batteryStatus":response[i].upsbatterystatus})
        }
      }
    }
      console.log(endResult.length)
    return res.json(endResult);
  });
});
//-----------------------end of filter----------------//

//------------------------filter api for voltage vs current for 1min table---------------//
app.post("/analytics/onemingraph", (req, res) => {
  const { date} = req.body;
  const currentvolt=[]
  
  const query = `select * from batteryoneminute where date(received_time)= '${date}'order by received_time asc`;
  meterDb.query(query, (error, response) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred' });
    }
    for (let i = 0; i < response.length; i++) {
      if(response[i].batteryVoltage){}
      let date = new Date(response[i].received_time);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      // const seconds = date.getSeconds().toString().padStart(2, '0');
      const timestamp = `${hours}:${minutes}`;
      
      currentvolt.push({"timestamp":timestamp,"batteryVoltage":parseInt(response[i].batteryvoltage),"batteryCurrent":parseFloat(response[i].batterycurrent)})
    }
    console.log(currentvolt)
    return res.json(currentvolt);
  });
});
//-------------------------end of api-------------------------//


//-----------------------------end of api-------------------------------//




            //ALERTS Logs
//

app.get("/Alert/Logs",async(req,res)=>{
    con.query("select * from alertLogs ",function(err,result,feilds){
        const logVavlues=[]
        if(err){
            console.log(err)
        }
        else{
            const response=(JSON.parse(JSON.stringify(result)))
            console.log(response.length,"alert logs  executed");

            for(let i=0;i<response.length;i++){
            const date = new Date(response[i].alerttime);
            const alertTime = date.toLocaleString();
            const alertTimestamp=alertTime.split(',')
            logVavlues.push({"id":response[i].recordId,"alerttimereceived":alertTimestamp,"alert":response[i].alert,"limitvalue":response[i].limitvalue,"systemName":response[i].systemName,"severity":response[i].severity,"action":response[i].action})
            }
            res.send(logVavlues)
            console.log(logVavlues)
        }
    })
   
}) 

// alerts filtering data api

app.post("/Alerts/filter", async (req, res) => {
    const { systemName } = req.body;
    const AlertFilter = [];
    // let query;
    // if (systemName==="Building Load") {
    //     query = `select * from alertLogs where systemName ='${systemName}'`;
    //   }
    //   if (systemName==="Chillers") {
    //     query = `select * from alertLogs where systemName ='${systemName}'`;
    //     console.log("filtered chillers alert")
    //   }
    //   if (systemName==="Thermal") {
    //     query = `select * from alertLogs where systemName ='${systemName}'`;
    //     console.log("filtered thermal alert")
    //   }
    const query=`select * from alertLogs where systemName ='${systemName}'`
      con.query(query, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred' });
        }
        console.log(results.length,`filter for ${systemName}  alert executed`);
        for (let i = 0; i < results.length; i++) {
          const date = new Date(results[i].alerttime);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          const year = date.getFullYear().toString();
          const month = (date.getMonth() + 1).toString().padStart(2, '0');
          const day = date.getDate().toString().padStart(2, '0');
          const formattedDate = `${day}/${month}/${year}`;
          const timeview = [formattedDate, timestamp];
    
          AlertFilter.push({"id":results[i].recordId,"alerttimereceived":timeview,"alert":results[i].alert,"limitvalue":results[i].limitvalue,"systemName":results[i].systemName,"severity":results[i].severity,"action":results[i].action});
        }
        //console.log(AlertFilter);
        return res.json(AlertFilter);
      });
  });
//--------------------------------------------------------------------------------------------------------------------------------------

//Thermal alert api



// --------------------------------------------------------------------------------------------------------------------------------------

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
    const sql = 'INSERT INTO EMSUPSshedulebatterycontrol (functioncode, starttime,endtime) VALUES (?, ?, ?)';
    con.query(sql, [functioncode, starttime,endtime], function (error, results, fields) {
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

// data filtering acording to the selected date for peakdemad data
app.post("/past/hvacSchneider7230Polling", (req, res) => {
    const { date,endDate} = req.body;
   
    const query = `SELECT * FROM hvacSchneider7230Polling WHERE DATE(polledTime) BETWEEN '${date}' AND '${endDate}' And totalApparentPower2>3900 `;
    chakradb.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
      }
      return res.json(results);
    });
  });
  
  
  // data filtering for single days data
  app.post("/singleday/hvacSchneider7230Polling", (req, res) => {
      const { date} = req.body;
     
      const query = `SELECT * FROM hvacSchneider7230Polling WHERE DATE(polledTime) = '${date}' And totalApparentPower2>2000 `;
      chakradb.query(query, (error, results) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: 'An error occurred' });
        }
        return res.json(results);
      });
    });

    //---------------------------//
    
    
    
    app.post("/filter/hvacSchneider7230Polling", (req, res) => {
  const { date, endDate,month } = req.body;
  const filterData = [];
  console.log(date, endDate);

  let query;
  if (endDate) {
    query = `SELECT * FROM peakdemanddaily WHERE DATE(polledTime) BETWEEN '${date}' AND '${endDate}'`;
    console.log('bar graph executed');
  }
//   else if(month){
//     query = `SELECT * FROM peakdemanddaily where  YEAR(polledTime)="2023" and MONTH(polledTime) = '${month}'`;
//     console.log("month query executed")
//   }
  // else {
  //     if(month){
  //   query = `SELECT * FROM peakdemanddaily where  YEAR(polledTime)="2023" and MONTH(polledTime) = '${month}'`;
  //   console.log("month query executed")
  // }

  //   // Filter by month
  //   // const year = date.substring(0, 4);
  //   // const month = date.substring(5, 7);
  //   // const firstDayOfMonth = `${year}-${month}-01`;
  //   // const lastDayOfMonth = `${year}-${month}-31`; // Assuming maximum 31 days per month

  //   // query = `SELECT * FROM peakdemanddaily WHERE DATE(polledTime) BETWEEN '${firstDayOfMonth}' AND '${lastDayOfMonth}'`;
  //   // console.log('line graph executed');
    
  // }
  else{
    query = `SELECT * FROM peakdemandquarter WHERE DATE(polledTime) = '${date}'`;
    console.log('single day filter executed')

  }

  meterDb.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred' });
    }
    console.log(results.length);
    for (let i = 0; i < results.length; i++) {
      const date = new Date(results[i].polledTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timestamp = `${hours}:${minutes}`;
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${day}/${month}/${year}`;
      const timeview = [formattedDate, timestamp];

      filterData.push({ "timestamp": timeview, "peakdemand": Math.trunc(results[i].peakdemand) });
    }
    console.log(filterData);
    return res.json(filterData);
  });
});

      
      
      
       app.get("/peak/hvacSchneider7230Polling",async(req,res)=>{
        meterDb.query("select * from peakdemandquarter where DATE(polledTime)=curdate();",function(err,result,feilds){
            const viewData=[]
            if(err){
                console.log(err)
            }
            else{
                const response=(JSON.parse(JSON.stringify(result)))
                for(let i=0;i<response.length;i++){
                    let date=new Date(response[i].polledTime)
                    const hours = date.getHours().toString().padStart(2, '0');
               const minutes = date.getMinutes().toString().padStart(2, '0');
               // const seconds = date.getSeconds().toString().padStart(2, '0');
               const timestamp = `${hours}:${minutes}`;
                    viewData.push({"polledTime":timestamp,"peakdemand":Math.trunc(response[i].peakdemand)})


                }
                res.send(viewData)
                console.log(viewData)
            }
        })
        
    })
    
     // wheeled in solar data filter according to datewise

//---------initial graph--------------//
app.get("/initial/wheeledinsolr", (req, res) => {
  const { date} = req.body;
  const inverters=[]
  const INV1=[]
  const INV2=[]
  const INV3=[]
  const INV4=[]
  const INV5=[]
  const INV6=[]
  const INV7=[]
  const INV8=[]
 
  const query = 'SELECT * FROM inverterprocessinghourly WHERE DATE(invertertimestamp) = curdate();'
  meterDb.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: 'An error occurred' });
    }
   
    for(let i=0;i<results.length;i++){
      if(results[i].inverterrecordid===1){
          INV1.push(results[i])
      }
      else if(results[i].inverterrecordid===2){
          INV2.push(results[i])

      }
      else if(results[i].inverterrecordid===3){
          INV3.push(results[i])

      }
      else if(results[i].inverterrecordid===4){
          INV4.push(results[i])

      }
      else if(results[i].inverterrecordid===5){
          INV5.push(results[i])

      }
      else if(results[i].inverterrecordid===6){
          INV6.push(results[i])

      }
      else if(results[i].inverterrecordid===7){
          INV7.push(results[i])

      }
      else if(results[i].inverterrecordid===8){
          INV8.push(results[i])

      }
    }
  inverters.push({"INV1":INV1,"INV2":INV2,"INV3":INV3,"INV4":INV4,"INV5":INV5,"INV6":INV6,"INV7":INV7,"INV8":INV8})
  console.log(inverters[0].INV1.length)
    return res.json(inverters);
  });
});
//-------------end api-------------//


// ----------------data filtering for single days data-------------------------//
app.post("/singleday/wheeledinsolr", (req, res) => {
    const { date} = req.body;
    const inverters=[]
    const INV1=[]
    const INV2=[]
    const INV3=[]
    const INV4=[]
    const INV5=[]
    const INV6=[]
    const INV7=[]
    const INV8=[]
   
    const query = `SELECT * FROM meterdata.inverterprocessinghourly WHERE DATE(invertertimestamp) = '${date}' `;
    meterDb.query(query, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
      }
     
      for(let i=0;i<results.length;i++){
        if(results[i].inverterrecordid===1){
            INV1.push(results[i])
        }
        else if(results[i].inverterrecordid===2){
            INV2.push(results[i])

        }
        else if(results[i].inverterrecordid===3){
            INV3.push(results[i])

        }
        else if(results[i].inverterrecordid===4){
            INV4.push(results[i])

        }
        else if(results[i].inverterrecordid===5){
            INV5.push(results[i])

        }
        else if(results[i].inverterrecordid===6){
            INV6.push(results[i])

        }
        else if(results[i].inverterrecordid===7){
            INV7.push(results[i])

        }
        else if(results[i].inverterrecordid===8){
            INV8.push(results[i])

        }
      }
    inverters.push({"INV1":INV1,"INV2":INV2,"INV3":INV3,"INV4":INV4,"INV5":INV5,"INV6":INV6,"INV7":INV7,"INV8":INV8})
    console.log(inverters[0].INV2.length)
      return res.json(inverters);
    });
  });
  //------------------------end of api------------------------------//


 //------------------roofTop hourly data post request-------------------//
 app.post("/roofTopHourly", async (req, res) => {
    const { date } = req.body;
    meterDb.query(`SELECT * FROM rooftophourly WHERE DATE(timestamp) = '${date}'`, function(err, qrres) {
      if (err) {
        console.log(err);
      } else {
        const response = JSON.parse(JSON.stringify(qrres));
        const data = response.map(entry => {
          const decimalval = Math.trunc(entry.total_cumulative_energy);
          const radiation=entry.sensor_solar_radiation
          const date = new Date(entry.timestamp);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          // const seconds = date.getSeconds().toString().padevchargerStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          //const timestamp = `${hours}`;
          return { timestamp, energy: decimalval,solarRadiation:radiation};
        });
        console.log(data);
        res.send(data);
      }
    });
  });
  //------------------------end of api--------------------------------//
  app.get("/current/roofTopHourlygraph", async (req, res) => {
    const { date } = req.body;
    meterDb.query(`SELECT * FROM rooftophourly WHERE DATE(timestamp) = curdate()`, function(err, qrres) {
      if (err) {
        console.log(err);
      } else {
        const response = JSON.parse(JSON.stringify(qrres));
        const data = response.map(entry => {
          const decimalval = Math.trunc(entry.total_cumulative_energy);
          const radiation=entry.sensor_solar_radiation
          const date = new Date(entry.timestamp);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          // const seconds = date.getSeconds().toString().padevchargerStart(2, '0');
          const timestamp = `${hours}:${minutes}`;
          //const timestamp = `${hours}`;
          return { timestamp, energy: decimalval,solarRadiation:radiation};
        });
        console.log(data);
        res.send(data);
      }
    });
  });


  //-----------------------------------------------------------------//



  //-------------analytics page of wmsMeter graph(post request according to date)------------//
  app.post("/wmsMeter/graphs", (req, res) => {
    const { date} = req.body;
   
    const query = `SELECT * FROM HourlyMeterData WHERE DATE(timestamp) = '${date}'`;
    meterDb.query(query, (error, results) => {
        const wmsMeterdata=[]
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
      }
      else{
        const response = JSON.parse(JSON.stringify(results));
        for(let i=0;i<response.length;i++){
            const date = new Date(response[i].timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            // const seconds = date.getSeconds().toString().padStart(2, '0');
            const timestamp = `${hours}:${minutes}`;

            // Splitting the time into hours and minutes
          var [converthours, convertminutes] = timestamp.split(":");

          // Converting the hours and minutes to integers
           parsehours = parseInt(converthours, 10);
           parseminutes = parseInt(convertminutes, 10);

       // Rounding off the time
       if (parseminutes >= 30) {
        parsehours += 1;
          }

// Formatting the rounded time
var roundedTime = parsehours.toString().padStart(2, "0") + ":00";
           
            wmsMeterdata.push({"cumulativepower":Math.trunc(response[i].cummulativemeterpower),"wmsirradiation":(Number(response[i].wmsirradiation)).toFixed(1),"instantaniousEnergy":Math.trunc(response[i].instantaneousenergy),"timestamp":timestamp})

        }
        console.log(wmsMeterdata)
        res.send(wmsMeterdata)
      }
   
    });
  })
  //----------------------------------- end of API-------------------------//
  //----------------------get request for wmsMeter data for analytics page graph-----------
  app.get("/initialgraph/wmsMeter", (req, res) => {
    const { date} = req.body;
   
    const query = 'SELECT * FROM HourlyMeterData WHERE DATE(timestamp) = curdate()';
    meterDb.query(query, (error, results) => {
        const wmsMeterdata=[]
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred' });
      }
      else{
        const response = JSON.parse(JSON.stringify(results));
        for(let i=0;i<response.length;i++){
            const date = new Date(response[i].timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            // const seconds = date.getSeconds().toString().padStart(2, '0');
            const timestamp = `${hours}:${minutes}`;

            // Splitting the time into hours and minutes
          var [converthours, convertminutes] = timestamp.split(":");

          // Converting the hours and minutes to integers
           parsehours = parseInt(converthours, 10);
           parseminutes = parseInt(convertminutes, 10);

       // Rounding off the time
       if (parseminutes >= 30) {
        parsehours += 1;
          }

// Formatting the rounded time
var roundedTime = parsehours.toString().padStart(2, "0") + ":00";
           
            wmsMeterdata.push({"cumulativepower":Math.trunc(response[i].cummulativemeterpower),"wmsirradiation":(Number(response[i].wmsirradiation)).toFixed(1),"instantaniousEnergy":Math.trunc(response[i].instantaneousenergy),"timestamp":timestamp})

        }
        //console.log(wmsMeterdata)
        res.send(wmsMeterdata)
      }
   
    });
  })
    
  //-------------------------end of API---------------------------------//
    
    


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
