// import React from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";
import GaugeChart from "react-gauge-chart";
import { PieChart } from 'react-minimal-pie-chart'; 
import { Line} from 'react-chartjs-2';
import {Pie} from 'react-chartjs-2';
import * as BsIcons from 'react-icons/bs';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import Chart from 'react-apexcharts';
import { useState,useEffect } from 'react';
import { batteryData } from './Apicalling';
import CircularProgress from '@mui/material/CircularProgress';
import Thermal from './Thermal';
import ForestIcon from '@mui/icons-material/Forest';
import { TiWeatherSnow } from "react-icons/ti";
import { BsFillCircleFill } from "react-icons/bs";
import EvchargerOn from '../images/charging-station-on.png'
import EvChargerOff from "../images/charging-station-off.png"
import Navbar from '../components/Navbar';
import BatteryHourly from './BatteryHourly';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LTOBatteryHourly from './LTOBatteryHourly';


import InfoTooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
// import {Link} from 'react-router-dom';
// import './DashBoard.css';


//import { LineChart,AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
// import { Zoom, ZoomButtons } from "recharts-plugin-zoom";
// import { WMSData } from './Wms';

// import BarChart from "react-bar-chart";
import './DashBoard.css'
import { fontSize } from '@mui/system';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
  
} from 'chart.js';
// import zoomPlugin from 'chartjs-plugin-zoom';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);
// ChartJS.register(ArcElement, Tooltip, Legend);


const host = "121.242.232.211"


function DashBoard() {
    // assigning chakra db data

  //   assigning battery data
  const [battery,setBattery]=useState([])

  // assigning WMS data
  const [wmsData,setWmsData]=useState([])

  const [solarData,setSolarData]=useState([])

  //sensordata assigmenet
  const [sensor,setSensor]=useState([])

  // meterdata assigment
  const [meter,setMeter]=useState([])

  // acemeter assigment
  const [acenergy,setAcenergy]=useState([])

  // grid data assignment
  const [grid,setGrid]=useState([])

  const [batterygraph,setBatterygraph]=useState(null)


  const [temp,setTemp]=useState(null)


  const [avgMinpowerfactor,setAvgMinpowerfactor]=useState([])


  const [dieselEnergy,setDieselEnergy]=useState([])


   const [EvCharger,setEvCharger]=useState([])

   const [thermalOverviewData,setThermalOverviewData]=useState([])
  
 
  const linestate  = {
    options: {
      chart: {
        type: 'area',
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      yaxis: {
        title: {
          text: "Sales",
        },
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        
        opacity: 0.5,
        type: "gradient",
      },
    },

      series: [
        {
          name: "Sales",
          data: [30, 40, -20, 25, -15, 50, 60, 70, -30, 80, 90, -10],
          stroke: {
            width: 2,
            colors: ["black "],
          },
          
        },
      ],
    
  }
  const url=`http://${host}:5000/sollar`
  const batteryurl=`http://${host}:5000/battery`
  const wms=`http://${host}:5000/wms`
  const solarPerformance=`http://${host}:5000/solarPerformance`
  const sensorurl=`http://${host}:5000/sensorreadings`
  const meterData=`http://${host}:5000/meterdata`
  const acmeterenergy=`http://${host}:5000/acmeterenergy`
  const griddata= `http://${host}:5000/grid`
  const temparature=`http://${host}:5000/thermaltemp`
  const rooftopac = `http://${host}:5000/rooftop`
  const energysaved = `http://${host}:5000/peaksavings`
  const chillerstatus = `http://${host}:5000/chillerstatusd`
  const chillerstatusph2 = `http://${host}:5000/chillerstatuse`
  const powerFactor= `http://${host}:5000/schneider7230readings`
  const diesel=`http://${host}:5000/dashboard/Deisel`
  const chargerdate=`http://${host}:5000/dashboard/EvCharger`
  const thermalApi=`http://${host}:5000/thermal/summaryCard`

  var totalrooftopgeneration
  const Roof = () => {
    const [result, setResult] = useState([])

  
    const namelist = () =>{
     axios.get(rooftopac).then((res)=>setResult(res.data))
    }


  
    useEffect(()=>{ 
      namelist()
 
    },[])
    totalrooftopgeneration = result[0]
    // console.log("rooftop : ",totalrooftopgeneration)
  }
  Roof()
  // console.log("rooftop : ",totalrooftopgeneration)

  var energySaved = 0
  const Peaksave = () => {
    const [energy,setEnergysaved] = useState([])

    const namelist = () =>{
      axios.get(energysaved).then((res)=>setEnergysaved(res.data))
     }

     useEffect(()=>{ 
      namelist()
    },[])

    energySaved = energy[0]
  }
  Peaksave()

  // chiller status function
  var chillerval = []
  const Chillerstatus = () => {
    const [chiller, setChiller] = useState([])

    const namelist = () =>{
      axios.get(chillerstatus).then((res)=>setChiller(res.data))
     }

     useEffect(()=>{ 
      namelist()
    },[])

    chillerval = chiller 
  }
  console.log(chillerval)
  Chillerstatus()

  var chillerval2 = []
  const Chillerstatush2 = () => {
    const [chiller, setChiller] = useState([])

    const namelist = () =>{
      axios.get(chillerstatusph2).then((res)=>setChiller(res.data))
     }

     useEffect(()=>{ 
      namelist()
    },[])

    chillerval2 = chiller 
  }
  Chillerstatush2()





  const values=[]

  const batterydata=()=>{
    batteryData().then(data => {
      setBattery(data);
    })
    .catch(error => {
      console.error(error);
    });
    // axios.get(batteryurl).then((res)=>{
    //   const response=res.data
    //   setBattery(response)

    // })
  }

 const WMSData=()=>{
    axios.get(wms).then((res)=>{
      const dataResponse=res.data
      setWmsData(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 


  const solarfunction=()=>{
    axios.get(solarPerformance).then((res)=>{
      const dataresponse=res.data
      setSolarData(dataresponse)
    })
  }

  const sensorfunction=()=>{
    axios.get(sensorurl).then((res)=>{
      const dataresponse=res.data
      setSensor(dataresponse)
    })
  }

  const meterfunction=()=>{
    axios.get(meterData).then((res)=>{
      const dataresponse=res.data
      setMeter(dataresponse)
    })
  }

  const acmeterenergyfunction=()=>{
    axios.get(acmeterenergy).then((res)=>{
      const dataresponse=res.data
      setAcenergy(dataresponse)
    })
  }


  const gridfunction=()=>{
    axios.get(griddata).then((res)=>{
      const dataresponse=res.data
      setGrid(dataresponse)
    })
  }
 let gridunprocess='';
  for(let i=0;i<grid.length;i++){
    gridunprocess=(grid[i].cumulative_energy)

  }
  console.log(grid)

  const TempData=()=>{
    axios.get(temparature).then((res)=>{
      const dataResponse=res.data
      setTemp(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  // powerfactor 
  const PowerFactor=()=>{
    axios.get(powerFactor).then((res)=>{
      const dataresponse=res.data
      console.log(dataresponse)
      setAvgMinpowerfactor(dataresponse)
     
    }).catch((err)=>{
      console.log(err)
    })
  }


    // powerfactor 
    const  PowerValue=()=>{
      axios.get("http://121.242.232.211:5000/schneider7230readings").then((res)=>{
        const dataresponse=res.data
        console.log(dataresponse)
       
       
      }).catch((err)=>{
        console.log(err)
      })
    }

  const DieselEnergyvalue=()=>{
    axios.get(diesel).then((res)=>{
      const dataresponse=res.data
      setDieselEnergy(dataresponse)
     
    }).catch((err)=>{
      console.log(err)
    })
  }


  
  const EvChargerData=()=>{
    axios.get(chargerdate).then((res)=>{
      const dataresponse=res.data
      setEvCharger(dataresponse)
     
    }).catch((err)=>{
      console.log(err)
    })
  }

 //thermal data
  const ThermalData=()=>{
    axios.get(thermalApi).then((res)=>{
      const dataResponse=res.data
      setThermalOverviewData(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 


  // piedata()
  //   batterydata()
  //   WMSData()
  //   solarfunction()
  //   sensorfunction()
  //   meterfunction()
  //   acmeterenergyfunction()
  //   gridfunction()




  useEffect(()=>{ 
 
    batterydata()
    WMSData()
    solarfunction()
    sensorfunction()
    meterfunction()
    acmeterenergyfunction()
    gridfunction()
    TempData()
    PowerFactor()
    DieselEnergyvalue()
    EvChargerData()
    PowerValue()
    ThermalData()

    const interval = setInterval(() => {
     
      batterydata();
      WMSData();
      solarfunction();
      sensorfunction();
      meterfunction();
      acmeterenergyfunction();
      gridfunction();
      TempData()
      PowerFactor()
      DieselEnergyvalue()
      EvChargerData()
      ThermalData()
      console.log("running every 5min ............")
  }, 5 * 60 * 1000);



    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
   },[])
    
   

 

  console.log(wmsData)
  console.log(solarData)
  console.log(sensor)
  console.log(meter)
  console.log(acenergy)
  console.log(grid)
  console.log(battery)
  console.log(avgMinpowerfactor)
  console.log(dieselEnergy)
  console.log(EvCharger)
 
 //----------- for power factor card
 let  minimum_powerfactor=""
 let  average_powerfactor=""
 for(let i=0;i<avgMinpowerfactor.length;i++){
  minimum_powerfactor=(avgMinpowerfactor[i].minimum_powerfactor)
  average_powerfactor=(avgMinpowerfactor[i].average_powerfactor)
 }

 //---------for diesel card
 let dieselvalue=""
 for(let i=0;i<dieselEnergy.length;i++){
  dieselvalue=(Math.round(dieselEnergy[i].total_energy_difference))
  
 }


 //-------------------for Evcharger card
 let totalEnergy=''
 let totalSessions=''
 let NoOfchargersused=''
 let totalHours=''
 let LEV1_1Status=""
 let LEV4_1Status=""
 let CP11_1Status=""
 let CP12_1Status=""
 let CP13_1Status=""
 let CP14_1Status=""

 for(let i=0;i<EvCharger.length;i++){
  totalEnergy=((EvCharger[i].totalEnergy))
  totalSessions=EvCharger[i].totalSessions
  NoOfchargersused=EvCharger[i].NoOfChargersUsed
  totalHours=EvCharger[i].totalTimeusage
  LEV1_1Status=EvCharger[i].LEV1_1Status
  LEV4_1Status=EvCharger[i].LEV4_1Status
  CP11_1Status=EvCharger[i].CP11_1Status
  CP12_1Status=EvCharger[i].CP12_1Status
  CP13_1Status=EvCharger[i].CP13_1Status
  CP14_1Status=EvCharger[i].CP14_1Status
}
console.log(LEV1_1Status,LEV4_1Status,CP11_1Status,CP12_1Status,CP13_1Status,CP14_1Status)










  
//---------------------------wheeled in solar card (generation)---------------------------------------------------//
// initialize variables to store previous and current values
let previousValue = null;
let currentValue = null;
const differenceValue=[]
const finalDifference=[]

// loop over the array of data and perform subtraction
for (let i = 0; i < meter.length; i++) {
  // set current value to the current item in the array
  currentValue = meter[i].meterenergy;

  // check if this is not the first item in the array
  if (previousValue !== null) {
    // subtract current value from previous value
    differenceValue.push(currentValue - previousValue);

    // do something with the difference value, such as logging it to the console
    // console.log(difference);
  }

  // set previous value to the current value for the next iteration
  previousValue = currentValue;
}


for(let i=0;i<differenceValue.length;i++){
  if(differenceValue[i]>0 && differenceValue[i]<1){
   finalDifference.push(differenceValue[i])

}
}



const totalgeneration= finalDifference.reduce((accumulator, currentValue) => {
  return accumulator + currentValue;
}, 0);
const totalsolargeneration=(totalgeneration*1000)
console.log(differenceValue)
//-----------------------end of calculation---------------------------------------



//---------------------------------building consumption card(grid)-------------------
const subSystemId1167=[]
const subSystemId1135=[]
const subSystemId358=[]
const subSystemId350=[]
for(let i=0;i<grid.length;i++){
  if(grid[i].acmetersubsystemid===1167){
    subSystemId1167.push(grid[i])
  }
  else if(grid[i].acmetersubsystemid===1135){
    subSystemId1135.push(grid[i])
  }
  else if(grid[i].acmetersubsystemid===358){
    subSystemId358.push(grid[i])
  }
  else if(grid[i].acmetersubsystemid===350){
    subSystemId350.push(grid[i])
  }
}

console.log(subSystemId1167,subSystemId1135,subSystemId358,subSystemId350)

let system1167previous = null;
let system1167current = null;
const system1167result=[]

// loop over the array of data and perform subtraction
for (let i = 0; i < subSystemId1167.length; i++) {
  // set current value to the current item in the array
  system1167current = subSystemId1167[i].acmeterenergy;

  // check if this is not the first item in the array
  if (system1167previous !== null) {
    // subtract current value from previous value
    const datadifference=system1167current - system1167previous
    // console.log(datadifference)
    system1167result.push(datadifference);

    // do something with the difference value, such as logging it to the console
    // console.log(difference);
  }

  // set previous value to the current value for the next iteration
  system1167previous = system1167current;
}
  console.log(system1167result)
  const totalsystem1167 = system1167result.reduce((accumulator, currentValue) => {
    return Math.trunc(accumulator + currentValue);
  }, 0);
  const resultValue1167=(totalsystem1167/1000)
  console.log(resultValue1167)
  

  //-------------------------------------------------------------------
  let system1135previous = null;
  let system1135current = null;
  const system1135result=[]
  
  // loop over the array of data and perform subtraction
  for (let i = 0; i < subSystemId1135.length; i++) {
    // set current value to the current item in the array
    system1135current = subSystemId1135[i].acmeterenergy;
  
    // check if this is not the first item in the array
    if (system1135previous !== null) {
      // subtract current value from previous value
      const datadifference=system1135current - system1135previous
      // console.log(datadifference)
      system1135result.push(datadifference);
  
      // do something with the difference value, such as logging it to the console
      // console.log(difference);
    }
  
    // set previous value to the current value for the next iteration
    system1135previous = system1135current;
  }
    console.log(system1135result)

    const totalsystem1135 = system1135result.reduce((accumulator, currentValue) => {
      return Math.trunc(accumulator + currentValue);
    }, 0);
    const resultvalue1135=(totalsystem1135/1000)

    // const totalrooftopgeneration=resultValueone+resultvaluetwo
    console.log(resultvalue1135)

    let system358previous = null;
let system1358current = null;
const system358result=[]

// loop over the array of data and perform subtraction
for (let i = 0; i < subSystemId358.length; i++) {
  // set current value to the current item in the array
  system1358current = subSystemId358[i].acmeterenergy;

  // check if this is not the first item in the array
  if (system358previous !== null) {
    // subtract current value from previous value
    const datadifference=system1358current - system358previous
    // console.log(datadifference)
    system358result.push(datadifference);

    // do something with the difference value, such as logging it to the console
    // console.log(difference);
  }

  // set previous value to the current value for the next iteration
  system358previous = system1358current;
}
  console.log(system358result)
  const totalsystem358 = system358result.reduce((accumulator, currentValue) => {
    return Math.trunc(accumulator + currentValue);
  }, 0);
  const resultValue358=(totalsystem358/1000)
  console.log(resultValue358)
  

  // -------------------------------------------------------------------
  let system350previous = null;
  let system350current = null;
  const system350result=[]
  
  // loop over the array of data and perform subtraction
  for (let i = 0; i < subSystemId350.length; i++) {
    // set current value to the current item in the array
    system350current = subSystemId350[i].acmeterenergy;
  
    // check if this is not the first item in the array
    if (system350previous !== null) {
      // subtract current value from previous value
      const datadifference=system350current - system350previous
      // console.log(datadifference)
      system350result.push(datadifference);
  
      // do something with the difference value, such as logging it to the console
      // console.log(difference);
    }
  
    // set previous value to the current value for the next iteration
    system350previous = system350current;
  }
    console.log(system350result)

    const totalsystem350 = system350result.reduce((accumulator, currentValue) => {
      return Math.trunc(accumulator + currentValue);
    }, 0);
    const resultvalue350=(totalsystem350/1000)

    // const totalrooftopgeneration=resultValueone+resultvaluetwo
    console.log(resultvalue350)

    console.log(resultValue1167+resultvalue1135+resultValue358+resultvalue350)
    const gridvalue=(resultValue1167+resultvalue1135+resultValue358+resultvalue350)
    console.log(gridvalue)








//---------------------------end of calculation----------------------------





  //  const totalEnergy = piechartdata.reduce((accumulator, currentValue) => {
  //   return Math.trunc(accumulator + currentValue.energy);
  // }, 0);
  

  // const totalrooftop = solar.reduce((accumulator, currentValue) => {
  //   return Math.trunc(accumulator + currentValue.energy);
  // }, 0);

  // const totalDeisel = diesel.reduce((accumulator, currentValue) => {
  //   return Math.trunc(accumulator + currentValue.energy);
  // }, 0);

  // const totalwheeledinsolar = rooftop.reduce((accumulator, currentValue) => {
  //   return  Math.trunc(accumulator + currentValue.energy);
  // }, 0);
  

  const totalwmsirradiation=wmsData.reduce((accumulator,currentValue)=>{
    return  Math.trunc(accumulator + currentValue.wmsirradiation);

  },0)
  
  


  const totalsolardata=solarData.reduce((accumulator,currentValue)=>{
    return  (accumulator + currentValue.irradiance);

  },0)

  const totalsensordata=sensor.reduce((accumulator,currentValue)=>{
    return  (accumulator + currentValue.sensorsolarradiation);

  },0)
  console.log((totalsensordata)/4000)


  // console.log(to)
  // Assuming you have fetched the data from the MySQL database and stored it in an array called 'data'

const hourlyAverages = {}; // to store hourly averages
let totalSum = 0; // to store total sum of the day
const emptyvalue=[]

solarData.forEach(record => {
  const time = new Date(record.time); // convert time to a Date object
  const hour = time.getHours(); // extract hour from the time

  // Calculate hourly average
  if (!hourlyAverages[hour]) {
    hourlyAverages[hour] = {
      count: 1,
      value: record.irradiance
    };
  } else {
    hourlyAverages[hour].count++;
    hourlyAverages[hour].value += record.irradiance;
  }

  // Calculate total sum
  totalSum += record.irradiance;
});

// Calculate hourly averages
Object.keys(hourlyAverages).forEach(hour => {
  hourlyAverages[hour].average = hourlyAverages[hour].value / hourlyAverages[hour].count;
  emptyvalue.push( hourlyAverages[hour].average)
});


console.log(emptyvalue); // Output hourly averages

const totaldaysumvalue=emptyvalue.reduce((accumulator,currentValue)=>{
  return  (accumulator + currentValue);

},0)
console.log(totaldaysumvalue)
















// console.log(emptyvalue); // Output total sum




 




  // console.log(totalEnergy)
  // console.log(totalrooftop)
  // console.log(totalDeisel)
 
  console.log(totalwmsirradiation)
  console.log(totalsolardata)



  //  to convert hole number to decimal value for rooftopsolar 
          // let number = totalrooftop;
          // let percentagenumber=number/1000
          // while (percentagenumber >= 1) {
          //   percentagenumber /= 10;
          // }
          // number = percentagenumber.toFixed(1);
      
  // to convert hole number to decimal value for rooftopsolar 
    // let wheeledpercentage=totalwheeledinsolar
    // let wheeledres=wheeledpercentage/1000
    //       while (wheeledres >= 1) {
    //         wheeledres /= 10;
    //       }
    //       wheeledpercentage=wheeledres.toFixed(1)



          var statusvalue=0

          //specific yeild calculation values
          var WISspecificyeild=(totalsolargeneration/2008.36).toFixed(2)
          var RTSspecificyeild=(totalrooftopgeneration/1075.8).toFixed(2)
          console.log(WISspecificyeild,RTSspecificyeild)

          // pr% calculation values
          const WheeledinsolarPR= totalsolargeneration/((totalwmsirradiation/60000)* 2008.36)
          const rooftopPR=totalrooftopgeneration/((totalsensordata/4000)*1075.8)
          let prpercentage = 0

          if (rooftopPR<1){
            prpercentage=rooftopPR*100
          }else if(rooftopPR>1){
            prpercentage=81
          }
          // const prpercentage=rooftopPR*100
          console.log(prpercentage, rooftopPR )
          const wheeledinsolarprpercentage=WheeledinsolarPR*100
          let WheeledinsolarperformanceValue=0
          if(wheeledinsolarprpercentage<100){
            WheeledinsolarperformanceValue= wheeledinsolarprpercentage

          }
          else{
            WheeledinsolarperformanceValue=0
          }
          console.log(WheeledinsolarperformanceValue)

           values.push(Math.round(gridunprocess),Math.trunc(totalrooftopgeneration),Math.trunc(totalsolargeneration),dieselvalue)
           console.log(values)



       //-------------------battery calculation----------------------
          //-------------------battery calculation----------------------
          const batteryStaus=[]
          const currentupsStatus=[]
          const timeStamp=[]
          const Status=[]
          const packSoc=[]
          const batteryresultdata=[]
   
          for(let i=0;i<battery.length;i+=60){
            if(battery[i].batteryStatus==="IDLE"){
              batteryStaus.push(0)
              currentupsStatus.push(battery[i].batteryStatus)
              const date = new Date(battery[i].timestamp);
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
              timeStamp.push(timeString)
   
              Status.push(battery[i].batteryStatus)
              packSoc.push(Math.trunc(battery[i].pack_usable_soc))
              batteryresultdata.push({"batteryStatus":battery[i].batteryStatus,"batteryEnergy":'0',"timeStamp":timeString})
   
             
   
            }
            else if(battery[i].batteryStatus==="DCHG"){
              batteryStaus.push(battery[i].dischargingAVG)
              currentupsStatus.push(battery[i].batteryStatus)
              const date = new Date(battery[i].timestamp);
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
              timeStamp.push(timeString)
              Status.push(battery[i].batteryStatus)
              packSoc.push(Math.trunc(battery[i].pack_usable_soc))
              batteryresultdata.push({"batteryStatus":battery[i].batteryStatus,"batteryEnergy":Math.trunc(battery[i].dischargingAVG),"timeStamp":timeString})
            }
            else if(battery[i].batteryStatus==="CHG"){
              batteryStaus.push(battery[i].chargingAVG)
              const date = new Date(battery[i].timestamp);
              currentupsStatus.push(battery[i].batteryStatus)
              let hours = date.getHours();
              const minutes = date.getMinutes();
              const ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12; // the hour '0' should be '12'
              const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
              timeStamp.push(timeString)
              Status.push(battery[i].batteryStatus)
              packSoc.push(Math.trunc(battery[i].pack_usable_soc))
              if (battery[i].chargingAVG !== null){
              batteryresultdata.push({"batteryStatus":battery[i].batteryStatus,"batteryEnergy":Math.trunc(battery[i].chargingAVG),"timeStamp":timeString})
              }
            }
   
          }
          console.log(batteryStaus)
         
          console.log(timeStamp)
          var time=timeStamp.map((res)=>res.split(",")[1])
          console.log(time)
          console.log(currentupsStatus)

    //   var apexcharts = {
    //     series: [{ 
    //     name: ' Battery Charging Status',
    //     data:batteryStaus.map((val)=>val)
    //   }],

    //     options:{
    //       chart: {
    //     type: 'area',
    //     height: 350
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     curve: 'straight'
    //   },
    //   // colors: ({ value }) => {
    //   //   return value < 0 ? '#00ff00' : '#ff0000';
    //   // },
      
    //   // title: {
    //   //   text: 'Area with Negative Values',
    //   //   align: 'left',
    //   //   style: {
    //   //     fontSize: '14px'
    //   //   }
    //   // },
    //   xaxis: {
    //    categories: time.map((time)=>time),
    //     // axisBorder: {
    //     //   show: false
    //     // },
    //     // axisTicks: {
    //     //   show: false
    //     // }
    //   },
    //   fill: {
    //     opacity: 0.5,
    //     below:"#008000",
    //     above:"#ff0000"

    //   },
    //   tooltip: {
    //           enabled: true,
    //           theme: 'dark',
    //           style: {
    //             background: '#222',
    //             color: '#fff'
    //           }
    //         },
    //   grid: {
    //     yaxis: {
    //       lines: {
    //         offsetX: -30
    //       }
    //     },
    //     padding: {
    //       left: 20
    //     }
    //   }
    // }
    //   };

      

    var apexcharts = {
      series: [{
  name: "cumulative energy",
  data: batteryresultdata.map((val) => (Math.trunc(val.batteryEnergy)))
}],

options: {
  chart: {
    type: 'bar',
    height: 350
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    curve: 'straight'
  },
  yaxis: {
    title: {
      text: 'discharge(-) , charge(+)',
    }
  },
  xaxis: {
    categories: batteryresultdata.map((time) => time.timeStamp),
    labels: {
      style: {
        colors: '#5A5A5A' // set the x-axis label color to red
      }
    },
    title: { text: "Time in Hour" },
  },
  fill: {
    opacity: 0.5,
   
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.7,
      opacityTo: 0.9,
      stops: [0, 100]
    },
  },
  tooltip: {
    enabled: true,
    theme: 'dark',
    style: {
      background: '#222',
      color: '#fff'
    }
  },
  grid: {
    yaxis: {
      lines: {
        offsetX: -30
      }
    },
    padding: {
      left: 20
    }
  },
  colors: ['#152138'], // Default color for all bars
  plotOptions: {
    bar: {
      colors: {
        ranges: [{
          from: Number.NEGATIVE_INFINITY,
          to: 0,
          color: '#00FF00' // Green color for negative values
        }]
      }
    }
  }
}
};



    //co2 reduction calculation
    const co2=((((parseFloat(totalsolargeneration)+parseFloat(totalrooftopgeneration))/1000)*0.71).toFixed(2))
    console.log((((parseFloat(totalsolargeneration)+parseFloat(totalrooftopgeneration))/1000)*0.71).toFixed(2))
    let co2ErrorValue=co2>100?0:co2

    

    



      


          

  



    const state = {
      series: values.map((data) => data),
      options: {
        chart: {
          width: '100%',
          height: '100%',
          type: 'donut',
        },
        zoom: {
          enabled: true,
        },
        toolbar: {
          show: true,
        },
        labels: ['Grid', 'Rooftop', 'wheeled_in_solar', 'Diesel'],
        // title: {
        //   text: 'Fruit Sales',
        //   align: 'center',
        //   style: {
        //     fontSize: '20px',
        //     fontWeight: 'bold',
        //   }
        // },
        legend: {
          show: false,
          position: 'right',
          labels: {
            colors: 'black',
            useSeriesColors: false,
            horizontalAlign: 'left',
            fontSize: '27px',
            markers: {
              fillColors: ['#1fc270', '#FFAE42', '#FF5349', '#546E7A']
            }
          }
        },
        plotOptions: {
          pie: {
            customScale: 0.9, // adjust the size of the donut circle
            dataLabels: {
              enabled: true,
              position: 'center',
              offsetX: 0,
              offsetY: 0,
              style: {
                fontSize: '20px',
                fontWeight: 'bold',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fill: 'black', // Set the text color to black
                textAnchor: 'middle',
              },
              formatter: function(val) {
                return '<tspan dy="0">' + state.options.title.text + '</tspan>';
              }
            }
          },
        },      
        colors: ['#1fc270', '#FFAE42', '#FF5349', '#546E7A'],
      },
    };


  const gaugeChartData = {
    series: [Math.trunc(prpercentage)], // Specify the value for the gauge chart
  };
  
 var gaugeChartOptions = {
    chart: {
    height: 350,
    type: 'radialBar',
    offsetY: -10
  },
  plotOptions: {
    radialBar: {
      startAngle: -135,
      endAngle: 135,
      dataLabels: {
        name: {
          fontSize: '16px',
          color: undefined,
          offsetY: 120
        },
        value: {
          offsetY: 76,
          fontSize: '22px',
          color: undefined,
          formatter: function (val) {
            return val + "%";
          }
        }
      }
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
        shade: 'dark',
        shadeIntensity: 0.15,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 50, 65, 91]
    },
  },
  stroke: {
    dashArray: 4
  },
  labels: ['Median Ratio'],
  colors: ['#0000FF'],
  };
  












  const optionsdata={
    responsive: true,
    type:'line',

    plugins:{
      legend:true,
      position: 'left',
      color:"white",
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy'
        }
      }
  
      
    },
    scales: {
      y: {
        ticks: { color: 'white', beginAtZero: true }
      },
      x: {
        ticks: { color: 'white', beginAtZero: true }
      }
    },
    
 


  }
  //  line chart
  const batterychart = {
    labels:timeStamp.map((time) => time),
    type:"line",
    datasets: [
      {
        label:"Charging Status",
        data:batteryStaus.map((val)=>val),
        // fill:true,
        backgroundColor:  [
          'rgba(255, 26, 104, 0.2)',
        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
        ],
        lineTension: 0.8,
        pointRadius: 2,
        fill:{
          target:"origin",
          below:'#00FF7F',
          above:'#20B2AA'
        },
      },

    ]
  }

  const data = {
    labels:['oct','nov','dec','jan','feb'],
    type:"line",
    datasets: [
      {
        label:"Charging Status",
        data: [-18,20,-19,-30,45,-0,-30],
        // fill:true,
        backgroundColor:  [
          'rgba(255, 26, 104, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(0, 0, 0, 0.2)'
        ],
        borderColor: [
          'rgba(255, 26, 104, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(0, 0, 0, 1)'
        ],
        lineTension: 0.8,
        pointRadius: 2,
        fill:{
          target:"origin",
          below:'#00FF7F',
          above:'#20B2AA'
        },
      },
    ]
  }



  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Time: ${batteryresultdata.timeStamp}`}</p>
          <p className="value">{`Value: ${batteryresultdata.batteryEnergy}`}</p>
        </div>
      );
    }
  
    return null;
  };
  
  const formatXAxis = (tickItem) => {
    return tickItem;
  };
  

  // const localtime=now.toDateString()
  // const now = new Date();
  // const local=now.toLocaleString()
  // const currentdate=local.split(",")[0]
  const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [month, day, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month

  // const formattedDate = now.toLocaleString('en-US', { 
  //   year: 'numeric', 
  //   month: '2-digit', 
  //   day: '2-digit', 
  //   hour: '2-digit', 
  //   minute: '2-digit', 
  //   second: '2-digit', 
  //   hour12: false
  // }).replace('/', '-');

  
const calculatedHeight = `calc(100vh - 100px)`;

let ThermalStatus=""
for(let i=0;i<thermalOverviewData.length;i++){
if(thermalOverviewData[i].chargingPump1Power>0 || thermalOverviewData[i].chargingPump2Power>0){
  ThermalStatus="CHARGING"

}
if(thermalOverviewData[i].dischargingPump1Power>0 || thermalOverviewData[i].dischargingPump2Power>0){
  ThermalStatus="DISCHARGING"

}
if(((thermalOverviewData[i].chargingPump1Power==0 || thermalOverviewData[i].chargingPump1Power==null) && (thermalOverviewData[i].chargingPump2Power==0|| thermalOverviewData[i].chargingPump2Power==null)) &&  ((thermalOverviewData[i].dischargingPump1Power==0 || thermalOverviewData[i].dischargingPump1Power==null) && (thermalOverviewData[i].dischargingPump2Power==0 || thermalOverviewData[i].dischargingPump2Power==null)) ){
  ThermalStatus="IDLE"

}
}
console.log(thermalOverviewData)



    
//info text for co2 redunction card
const longText = " According to CEA Emission Database,2021 the weighted C02 emissions factor is 0.71 tCO2/MWh Amount of CO2 Reduced = 0.71* Renewable Energy Generated "




  return (
    <div>

   
    <div   className="main" style={{marginRight:"30px",marginLeft:"30px",marginBottom:"50px"}} >

  <div class="row"   >
    {/* ----------- */}
   
  <div class="col-sm-12 mb-3 mb-sm-0">
  <div class="container-fluid">

  <div class="card1" style={{width: "100%", height: calculatedHeight,justifyContent: 'center', marginTop:0, background: 'white', color: "white"}} >
  <h3 style={{textAlign:"end",color:"#b03d2b",textAlign:"center",marginTop:"20px"}}><b>{currentdate}</b></h3>
<div   class="card-body d-flex flex-column justify-content-center">
<div class="row" >

<div class="col-sm-4 mb-3 mb-sm-0"  >
<div  style={{ position: 'relative' }}>

        <ReactApexChart options={state.options} series={state.series} type="donut" width={'100%'} height={'400px'}  />
        <Link to='/peakgraph' style={{ textDecoration: 'none' }}> 
        <p class="card-title" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', zIndex: 1 }}><b>Building Consumption</b></p>
        </Link>
      </div>
</div>
<div  class="col-sm-8 mb-3 mb-sm-0" >
<div style={{marginTop:"10px",marginLeft:"30px"}}> 
<div class="data-container-legends">
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#1fc270'/> &nbsp; <b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Grid</b> </span>
    </span>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#FFAE42'/> &nbsp;<b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Rooftop</b> </span>

    </span>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#FF5349'/>&nbsp;<b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Wheeled in  solar</b> </span>  

    </span>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#546E7A'/>&nbsp;<b  style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Diesel</b> </span>  

    </span>
  </div>
  
  <div style={{ color: '#5e5d5c', textAlign: 'right', fontSize: "22px",marginTop:"30px",marginRight:"80px"}}> 
 
 <h5><b>*Energy in kWh</b></h5>

</div>
</div>
<br/>

  <div class="container">
  <div class="row">
    <div class="col-6">
      <table> 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c',marginLeft:"50px"}}>Wheeled in solar:</b></td>
          <td style={{ fontSize: "25px",color:"black"}} >{Math.trunc(totalsolargeneration)}</td>
        </tr>
      </table>
    
    </div>
    <div class="col-6">
    <table style={{marginLeft:"50px"}}> 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c'}}>Diesel:</b></td>7
          <td style={{ fontSize: "25px",color:"black"}} >{dieselvalue}</td>
        </tr>
      </table>
    </div>
  </div>
  </div>
  <br/>
  <div class="container" style={{ marginTop:"10px"}}>
  <div class="row">
    <div class="col-6">
      <table> 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c',marginLeft:"50px"}}>Rooftop{' '} :</b></td> 
          <td style={{ fontSize: "25px",color:"black"}} >{Math.trunc(totalrooftopgeneration)}</td>
        </tr>
      </table>
    
    </div>
    <div class="col-6">
    <table style={{marginLeft:"50px"}}> 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c'}}>Grid{' '} :</b></td>
          <td style={{ fontSize: "25px",color:"black"}} >{Math.round(gridunprocess)}</td>
        </tr>
      </table>
    </div>
  </div>
  </div>

  <br/>
  <div class="container" style={{ marginTop:"10px"}}>
  <div class="row">
    <div class="col-6">
      <table > 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c',marginLeft:"50px"}}>Power Factor(Min){' '} :</b></td>
          <td style={{ fontSize: "25px",color:"black"}} > {minimum_powerfactor}</td>
        </tr>
      </table>
    
    </div>
    <div class="col-6">
    <table style={{marginLeft:"50px"}} > 
        <tr> 
          <td><b style={{ fontSize: "25px",color: '#5e5d5c'}}>Power Factor(Avg){' '} :</b></td>
          <td style={{ fontSize: "25px",color:"black"}} >{average_powerfactor}</td>
        </tr>
      </table>
    </div>
  </div>
  </div>

{/* <div class="data-container"style={{ marginTop:"10px",marginRight:"3%"}}>
    <span>
      <span style={{ color: '#5e5d5c' }}>
        <b style={{ fontSize: "22px"}}>Power Factor(Min):</b>
      </span>
      <span style={{ color: 'black', textAlign: 'right', fontSize: "22px" }}>
      {minimum_powerfactor}
      </span>
    </span>
   
  
    <span>
      <span style={{ color: '#5e5d5c' }}>
        <b style={{ fontSize: "22px"}}>Power Factor(Avg):</b>
      </span>
      <span style={{ color: 'black', textAlign: 'right', fontSize: "22px"}}>
      {average_powerfactor}
      </span>
    </span>
  </div> */}


<div>
{/* <table> 
  <tr> 
  <td style={{ color: '#5e5d5c'}}><h5><b style={{fontSize:"22px"}}>Min_powerfactor:</b></h5></td>
    <td style={{ color: 'black', textAlign: 'right' }}><h4>{minimum_powerfactor}</h4></td>
    <td style={{ width: '30px' }}></td>
    <td>   </td>
     <td>  </td>
    <td style={{ color: '#5e5d5c'}}><h5><b style={{fontSize:"22px"}}>Avg_powerfactor:</b></h5></td>
    <td style={{ color: 'black', textAlign: 'right' }}><h4>{average_powerfactor}</h4></td>
   
  </tr>
  
</table> */}

</div>
<br/>
{/* <div style={{ color: 'black', textAlign: 'right',justifyContent:"flex-end",justifyItems:"baseline" }}>
<Link to='/peakgraph'>
<button className="btn btn-primary">Analytics</button>
</Link>
</div> */}

</div>


</div>


</div>
</div>
</div>
  

 
  </div>
  

  {/* ------------------- */}

  <div class="col-sm-4" style={{border: '1px solid red top bottom left'}} >
    <div class="card" style={{width:"auto",height:"100%",marginTop:"0%",background:'white',color:"white"}}>
      <div class="card-body">
      <div class="container">
  <div class="row">
    <div class="col-6">
    <h5 class="card-title" style={{color:"#145369"}}><b>Wheeled in Solar </b></h5>
    </div>
    <div class="col-6" >
    <Link to='/Wheeledgraph' style={{marginLeft:"70px"}}>
         {/* <button type="button" class="btn btn-outline-success">Explore</button> */}
         <QueryStatsIcon style={{ fontSize: '35px', color: 'black', marginLeft: '10px',width:"100px" }}/>
      </Link>
    </div>
    </div>
    </div>
    <div class="row"> 
    <div class="col-6">
      <h5>
    <p style={{ textDecoration: 'underline !important', color: 'black',marginLeft:"10px" }}><b>Performance(%):</b></p>
    </h5> 
    </div>

    </div>
  
          <h1 style={{fontSize:"150px",textAlign:"center",color:"tomato",height:"200px"}}> 
         {Math.trunc(WheeledinsolarperformanceValue)}%
         <br></br>
         <hr style={{color:"green",border:"1px solid gray"}}/>
         </h1>
         
        
        

        
       <br/>

        {/* <GaugeChart 
          id="gauge-chart5"
          nrOfLevels={10}
          arcsLength={[0.3, 0.3, 0.3,0.3,0.3]}
          colors={["#FF0000","#FF4500","#f9bd00","#9bf400","#008000"]}
          arcWidth={0.3}
          percent={(WheeledinsolarPR).toFixed(2)}
          needleColor="black" 
          arcPadding={0.02}
          textColor="black"
          // 689.065186

          // textColor={'white'}
          // style={{width:"fit-content",height:"100",alignItems:"center"}}
          // width={150}
          
        /> */}
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'19px',margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Generation (kWh):</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(totalsolargeneration)}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>Performance %:</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(wheeledinsolarprpercentage)}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>Specific yield (kWh/kWp):</b></td>
    <td><span style={{color:"black"}}>{WISspecificyeild}</span></td>
  </tr>


  <tr>
    <td><b style={{color:"#5e5d5c"}}>Irradiation (kWh/m2):</b></td>
    <td><span style={{color:"black"}}>{(totalwmsirradiation/60000).toFixed(2)}</span></td>
  </tr>
</table>
        
        
      </div>
    </div>
  </div>


  <div class="col-sm-4" >
  <div class="card" style={{width:"auto",height:"100%",background:'white',color:"white"}}>
      <div class="card-body">
      <div class="container">
  <div class="row">
    <div class="col-6">
    <h5 class="card-title" style={{color:"#145369"}}><b>Rooftop Solar </b></h5>
    </div>
    <div class="col-6" >
    <Link to='/RoofTopSolar' style={{marginLeft:"70px"}}>
         {/* <button type="button" class="btn btn-outline-success">Explore</button> */}
         <QueryStatsIcon style={{ fontSize: '35px', color: 'black', marginLeft: '10px',width:"100px" }}/>
      </Link>
    </div>
    </div>
    </div>
    <div class="row"> 
    <div class="col-6">
      <h5>
    <p style={{ textDecoration: 'underline !important', color: 'black',marginLeft:"10px" }}><b>Performance(%):</b></p>
    </h5> 
    </div>
    </div>
  
        <h1 style={{fontSize:"150px",textAlign:"center",color:"brown",height:"200px"}}> 
         {Math.trunc(prpercentage)}%
         <br></br>
         <hr style={{color:"green",border:"1px solid gray"}}/>
         </h1>
        <br/>
      
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'19px', margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Generation (kWh):</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(totalrooftopgeneration)}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>Performance %:</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(prpercentage)}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>Specific yield (kWh/kWp):</b></td>
    <td><span style={{color:"black"}}>{RTSspecificyeild}</span></td>
  </tr>
 
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Irradiation (kWh/m2):</b></td>
    <td><span style={{color:"black"}}>{(totalsensordata/4000).toFixed(2)}</span></td>
  </tr>
</table>
       
      </div>
    </div>
  </div>


  <div class="col-sm-4">
    <div class="card"  style={{width:"100%",height:"100%", background: 'lineargradient(to top, rgb(184, 204, 195), white)',color:"white"}}>
      <div class="card-body">
        <div class="row"> 
        <div class="col-10"> 
        <h4 class="card-title" style={{textAlign:"center",color:"#145369",marginLeft:"50px"}}><b>CO<sub>2</sub> Reduction</b></h4>
        </div>
        <div class="col-2"> 
        <InfoTooltip title={longText} style={{color:"gray"}}>
       <InfoOutlinedIcon />
      </InfoTooltip>
        </div>

        </div>
        <br/>
        <br/>
        {/* <p style={{textAlign:"end",color:"black"}}>{currentdate}</p> */}
        <h5 style={{color:"black",textAlign:"center",fontSize:"30px"}}> Today's</h5>
        <h5 style={{color:"black",textAlign:"center",fontSize:"30px"}}> <b>CO<sub>2</sub> Reduction:</b></h5>
        <div style={{textAlign:"center"}}  > 
        {/* <ForestIcon  /> */}
        <h1 style={{fontSize:"120px",textAlign:"center",color:"#2D5987",height:"170px",fontWeight:"bolder"}}> 
        {co2ErrorValue}
         <br></br>
         </h1>

         <h5 style={{textAlign:"center",color:"black",fontSize:"20px"}}><b>Tons of CO2 equivalent</b></h5>

        {/* <img src="https://png.pngtree.com/png-vector/20220518/ourmid/pngtree-flat-template-with-co2-leaves-for-concept-design-png-image_4674847.png" alt="co2" width="200" height="200" style={{ textalign: "center", borderRadius:"100px"}}/> */}

        </div>
        
        
        
      </div>
    </div>
  </div>

  
{/* ------- */}

<div class="col-sm-4" style={{marginTop:"5%" }}>
<div class="card" style={{width:"100%",height:"100%",background: 'lineargradient(to right, ligh, white)',color:"white",id:"chillercard"}}>
  <div class="card-body">
  <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>Chiller Status</b></h4>
    <hr/>
    {/* <p style={{textAlign:"end",color:"black"}}>{currentdate}</p> */}
    {/* <Line data={data} options={optionsdata}/> */}
    {/* <ReactApexChart options={batterystatus.options} series={batterystatus.series} type="line" height={190} /> */}

    <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px',margin: '0 auto'}}>
    <tr>
        <td><b style={{color:"#4d4b47"}}>Chillers D-Block :</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;1</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;2</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;3</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;4</b></td>
      </tr>
      <br/>
      <tr class="icon">
        <td><b style={{color:"black"}}></b></td>
        <td><span>{chillerval[0] === 0 || chillerval[0] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</span></td>
        <td>{chillerval[1] === 0 || chillerval[1] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval[2] === 0 || chillerval[2] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval[3] === 0 || chillerval[3] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
      </tr>
      <br/>
      <tr>
        <td><b style={{color:"#4d4b47"}}>Chillers E-block :</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;5</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;6</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;7</b></td>
        <td><b style={{color:"black"}}>&nbsp;&nbsp;8</b></td>
      </tr>
      <br/>
      <tr class="icon">
      <td><b style={{color:"black"}}></b></td>
        <td><span>{chillerval2['chiller5'] <= 800 || chillerval2['chiller5'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</span></td>
        <td>{chillerval2['chiller6'] === 0 || chillerval2['chiller6'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval2['chiller7'] === 0 || chillerval2['chiller7'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval2['chiller8'] === 0 || chillerval2['chiller8'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
      </tr>
    </table>
    <br/>
    
    <div class="card-text"style={{color:"black",font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px',marginTop:"10px" }}> 
    <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>Thermal Storage Status</b></h4>
    {/* <br/> */}
    {/* <h3 style={{color:"black",textAlign:"center"}}>{ThermalStatus}</h3> */}
    <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px',margin: '0 auto'}}> 
    <td  ><b>{ThermalStatus}</b></td>

    </table>
    <br/>
    <div style={{ color: '#5e5d5c', textAlign: 'right', fontSize: "22px"}}> 
         <Link to='/Status/chillersStatus'>
         <button type="button" class="btn btn-outline-success">Explore</button>
      </Link> 
      </div> 
 
    

    </div>
  </div>
</div>
</div> 

<div class="col-sm-8" style={{marginTop:"5%" }}>
    <div class="card" style={{height:"100%",background:'white',color:"white"}}>
      <div class="card-body">
      <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>Thermal Storage</b></h4>
        <Thermal />
        <div class="card-text"style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px',marginTop:"10px" }}> 
        {/* <b style={{color:"black"}}>Cooling Energy:</b> */}
          <br/>
          {/* <b style={{color:"#5e5d5c"}}>Stored Water Temperature(°C) : {temp}</b> */}
          <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
          <tr>
    <td><b style={{color:"#5e5d5c"}}>Stored Water Temperature(°C):</b></td>
    <td><span style={{color:"black"}}> {temp}</span></td>
  </tr>
</table>

        </div>
      </div>
    </div>
  </div>

  


  

  <div class="col-sm-6" style={{marginTop:"5%"}}>
    <div class="card" style={{height:"100%",background: ' white',color:"white"}}>
      <div class="card-body">
      {/* <h5 class="card-title"><b style={{color:"#145369"}}>UPS Battery</b><span style={{color:"black",marginLeft:'100px' }}>Status:</span> {currentupsStatus ?  <BsIcons.BsBatteryFull color="yellow" fontSize="1.5em"/>:<BsIcons.BsBatteryFull color="green" fontSize="1.5em"/> }</h5> */}
      <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>UPS Battery</b></h4> 
        <hr/>
        <div id="chart2"> 
       <BatteryHourly/>
  
   </div>
   <div class="card-text"style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px' }}> 
          <br/>

        </div>
      </div>
    </div>
  </div>


  <div class="col-sm-6" style={{marginTop:"5%"}}>
    <div class="card" style={{height:"100%",background: ' white',color:"white"}}>
      <div class="card-body">
      {/* <h5 class="card-title"><b style={{color:"#145369"}}>UPS Battery</b><span style={{color:"black",marginLeft:'100px' }}>Status:</span> {currentupsStatus ?  <BsIcons.BsBatteryFull color="yellow" fontSize="1.5em"/>:<BsIcons.BsBatteryFull color="green" fontSize="1.5em"/> }</h5> */}
      <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>LTO Battery</b></h4> 
        <hr/>
        <div id="chart2"> 
        <LTOBatteryHourly/>
  
   </div>
   <div class="card-text"style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px' }}> 
          <br/>

        </div>
      </div>
    </div>
  </div>

  <div class="col-sm-4"  style={{marginTop:"5%"}}>
     <div class="card" style={{width:"100%", height:"100%",background: 'lineargradient(to right, lightblue, white)',color:"white"}}>
       <div class="card-body">
         <h4 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>EV Charger</b>  </h4>
         
         <hr/>

         {/* <div style={{display: 'flex', justifyContent: 'center'}}>
  <img src={Evcharger} alt="evcharger" width="250px" height="250px" />
</div> */}
 {/* let LEV1_1Status=""
 let LEV4_1Status=""
 let CP11_1Status=""
 let CP12_1Status=""
 let CP13_1Status=""
 let CP14_1Status="" */}
<div class="row">
  <div class="col-4">
    <h5 style={{color:"black"}}><b>1</b></h5>
    {
      LEV1_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="50px" height="50px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
  <div class="col-4">
    <h5 style={{color:"black"}}><b>2</b></h5>
    {
      LEV4_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="100px" height="100px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
  <div class="col-4">
    <h5 style={{color:"black"}}><b>3</b></h5>
    {
      CP11_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="100px" height="100px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
</div>
<br/>
<br/>
<div class="row">
  <div class="col-4">
    <h5 style={{color:"black"}}><b>4</b></h5>
    {
      CP12_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="100px" height="100px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
  <div class="col-4">
    <h5 style={{color:"black"}}><b>5</b></h5>
    {
      CP13_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="100px" height="100px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
  <div class="col-4">
    <h5 style={{color:"black"}}><b>6</b></h5>
    {
      CP14_1Status==="active"?<img src={EvchargerOn} alt="evcharger" width="100px" height="100px" />:<img src={EvChargerOff} alt="evcharger" width="100px" height="100px" />
    } 
  </div>
</div>

<br/>
<br/>
<br/>
<br/>
  <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'19px', margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Total Energy Used (kWh):</b></td>
    <td><span style={{color:"black"}}>{totalEnergy}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>Total Session Today:</b></td>
    <td><span style={{color:"black"}}>{totalSessions}</span></td>
  </tr>

  <tr>
    <td><b style={{color:"#5e5d5c"}}>No.Of chargers used:</b></td>
    <td><span style={{color:"black"}}>{NoOfchargersused}</span></td>
  </tr>
 
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Total hours of usage(hr):</b></td>
    <td><span style={{color:"black"}}>{totalHours}</span></td>
  </tr>
</table>
         {/* <p> Shavings:</p> */}
       </div>
     </div>
  </div>


  










   
{/* 
  <div class="col-sm-4"  style={{marginTop:"5%"}}>
     <div class="card" style={{width:"100%", height:"100%",background:'white',color:"white"}}>
       <div class="card-body">
         <h5 class="card-title" style={{textAlign:"center",color:"#145369"}}><b>Peak Shavings</b>  </h5>
         
         <hr/>
         <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>

         <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px',margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Energy saved (kWh):</b></td>
    <td><span style={{color:"black"}}>{energySaved}</span></td>
  </tr>
  <br/>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Cost saved (Rs):</b></td>
    <td><span style={{color:"black"}}>-</span></td>
  </tr>
  </table>
       </div>
     </div>
  </div> */}
 



  

 


   
</div>






    


    </div>
    </div>
  )
}

export default DashBoard









//--------------------- rooftop solar card(generation)-----------------------------------------------
// const subSystemIdOne=[]
// const subSystemIdTwo=[]

// for(let i=0; i<acenergy.length;i++){
//   if(acenergy[i].acmetersubsystemid===1147){
//     subSystemIdOne.push(acenergy[i])
//   }
//   else if(acenergy[i].acmetersubsystemid===1035){
//     subSystemIdTwo.push(acenergy[i])
//   }

// }
// console.log(subSystemIdOne)
// //----------------------------------------------------
// let subSystemIdOneprevious = null;
// let subSystemIdOnecurrent = null;
// const subSystemIdOneresult=[]

// // loop over the array of data and perform subtraction
// for (let i = 0; i < subSystemIdOne.length; i++) {
// // set current value to the current item in the array
// subSystemIdOnecurrent = subSystemIdOne[i].acmeterenergy;

// // check if this is not the first item in the array
// if (subSystemIdOneprevious !== null) {
//   // subtract current value from previous value
//   const datadifference=subSystemIdOnecurrent - subSystemIdOneprevious
//   console.log(datadifference)
//   subSystemIdOneresult.push(subSystemIdOnecurrent - subSystemIdOneprevious);

//   // do something with the difference value, such as logging it to the console
//   // console.log(difference);
// }

// // set previous value to the current value for the next iteration
// subSystemIdOneprevious = subSystemIdOnecurrent;
// }
// console.log(subSystemIdOneresult)
// const totasubsystemOne = subSystemIdOneresult.reduce((accumulator, currentValue) => {
//   return Math.trunc(accumulator + currentValue);
// }, 0);
// const resultValueone=(totasubsystemOne/1000)


// //-------------------------------------------------------------------
// let subSystemIdTwoprevious = null;
// let subSystemIdTwocurrent = null;
// const subSystemIdTworesult=[]

// // loop over the array of data and perform subtraction
// for (let i = 0; i < subSystemIdTwo.length; i++) {
//   // set current value to the current item in the array
//   subSystemIdTwocurrent = subSystemIdTwo[i].acmeterenergy;

//   // check if this is not the first item in the array
//   if (subSystemIdTwoprevious !== null) {
//     // subtract current value from previous value
//     const datadifference=subSystemIdTwocurrent - subSystemIdTwoprevious
//     console.log(datadifference)
//     subSystemIdTworesult.push(subSystemIdTwocurrent - subSystemIdTwoprevious);

//     // do something with the difference value, such as logging it to the console
//     // console.log(difference);
//   }

//   // set previous value to the current value for the next iteration
//   subSystemIdTwoprevious = subSystemIdTwocurrent;
// }
//   console.log(subSystemIdTworesult)

//   const totasubsystemTwo = subSystemIdTworesult.reduce((accumulator, currentValue) => {
//     return Math.trunc(accumulator + currentValue);
//   }, 0);
//   const resultvaluetwo=(totasubsystemTwo/1000)

//   const totalrooftopgeneration=resultValueone+resultvaluetwo
//   console.log(totalrooftopgeneration)
  






