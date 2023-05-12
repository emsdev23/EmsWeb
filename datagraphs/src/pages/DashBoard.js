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
import { useState,useEffect } from 'react';
import { batteryData } from './Apicalling';
import CircularProgress from '@mui/material/CircularProgress';
import Thermal from './Thermal';
import ForestIcon from '@mui/icons-material/Forest';
import { TiWeatherSnow } from "react-icons/ti";


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


const host = "localhost"


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
    gridunprocess=(grid[i].Energy)

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

    const interval = setInterval(() => {
     
      batterydata();
      WMSData();
      solarfunction();
      sensorfunction();
      meterfunction();
      acmeterenergyfunction();
      gridfunction();
      TempData()
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





  
//---------------------------wheeled in solar card (generation)---------------------------------------------------//
// initialize variables to store previous and current values
let previousValue = null;
let currentValue = null;
const differenceValue=[]

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




const totalgeneration= differenceValue.reduce((accumulator, currentValue) => {
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

           values.push(Math.round(gridunprocess),Math.trunc(totalrooftopgeneration),Math.trunc(totalsolargeneration),0)
           console.log(values)



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
          batteryresultdata.push({"batteryStatus":battery[i].batteryStatus,"batteryEnergy":(battery[i].dischargingAVG).toFixed(2),"timeStamp":timeString})
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
          batteryresultdata.push({"batteryStatus":battery[i].batteryStatus,"batteryEnergy":(battery[i].chargingAVG).toFixed(2),"timeStamp":timeString})
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
        name:"cumilative energy",
        data: batteryresultdata.map((val)=>(val.batteryEnergy))
      }],
    
      options: {
        chart: {
          type: 'area',
          height: 350
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        colors: ['#152138', '	#00FF00'], // Red for positive values, green for negative values
        // colors: ({ value }) => {
        //   return value < 0 ? ['#00ff00'] : ['#ff0000'];
        // },
        yaxis: {
          title: {
            text: 'DCHG (-) | CHG (+) Energy ',
          }
        },
        xaxis: {
          categories: batteryresultdata.map((time) => time.timeStamp),
          labels: {
            style: {
              colors: '#5A5A5A' // set the x-axis label color to red
            }
          },
          title : {text:"Time in Hour"},
        },
        fill: {
          opacity: 0.5,
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 100]
          },
        
          colors: ['#0000FF']
        },
        // fill:{
        //   target:"origin",
        //   below:'#00FF7F',
        //   above:'#20B2AA'
        // },
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
        // markers: {
        //   fillColor: '#e3e3e3',
        //   strokeColor: '#fff',
        //   size: 3,
        //   shape: "circle" 
        // },
      }
    };

    // const apexcharts = {
          
    //   series: [{
    //     name: 'Battery Status',
    //     data: batteryStaus.map((val)=>val)
    //   }],
    //   options: {
    //     chart: {
    //       type: 'bar',
    //       height: 350
    //     },
    //     plotOptions: {
    //       bar: {
    //         colors: {
    //           ranges: [{
    //             from: 0,
    //             to: 100,
    //             color: '#008000'
    //           }, {
    //             from: -0,
    //             to: -100,
    //             color: '#FF0000'
    //           }]
    //         },
    //         columnWidth: '80%',
    //       }
    //     },
    //     dataLabels: {
    //       enabled: false,
    //     },
    //     yaxis: {
    //       title: {
    //         text: 'Growth',
    //       },
    //       labels: {
    //         formatter: function (y) {
    //           return y.toFixed(0) + "%";
    //         }
    //       }
    //     },
    //     xaxis: {
    //       //type: 'datetime',
    //       categories:time.map((time) => time),
    //       labels: {
    //         rotate: -90
    //       }
    //     },
    //       tooltip: {
    //           enabled: true,
    //           theme: 'dark',
    //           style: {
    //             background: '#222',
    //             color: '#fff'
    //           }
    //         },
    //   },
    
    
    // };


    //co2 reduction calculation
    const co2=(((Math.trunc(totalsolargeneration)+totalrooftopgeneration)/1000)*0.81).toFixed(2)


    

    



      


          

  



  const state = {
          
    series: values.map((data)=>data),
            options: {
              chart: {
                width: '100%',
                height: '100%' ,
                type: 'pie',
              },
              zoom: {
                enabled: true
              },
              toolbar: {
                show: true
              },
              labels: ["Grid", "Rooftop","wheeled_in_solar","Diesel"],

              legend:{
                labels:{
                  fontSize:"20px"
                },
      
              },
              //"wheeled_in_solar"
              
              plotOptions: {
                pie: {
                  dataLabels: {
                    offset: -5
                  }
                }
              },
              // title: {
              //   text: "Monochrome Pie"
              // },
              // dataLabels: {
              //   formatter(val, opts) {
              //     const name = opts.w.globals.labels[opts.seriesIndex]
              //     return [name, val.toFixed(1) + '%']
              //   }
              // },
              colors: ['#1fc270', '#FFAE42','#FF5349', '#546E7A'],
              //
              legend: {
                show: true,
                position:"top",
                labels: {
                  colors: "black",
                  useSeriesColors: false
              },
              fontSize: '17px',
              fontFamily: 'Helvetica, Arial',
              fontWeight: 400,
              

              }
            },

  }

  












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

  const batterystate = {




    series: [{
      name: 'chargingenergy',
      data:battery.map((val)=>val),
    }, {
      name: 'dischargingenergy',
      data: battery.map((val)=>val.discharging)
    }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        fill:true,
        zoom: {
          enabled: true
        }
      },
      fill: {
        // colors: ['#008FFB', '#00E396'],
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.9,
          stops: [0, 90, 100]
        },
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth'
        
      },
      
      markers: {
        size: [4, 4]
      },
      xaxis: {
        // type: 'datetime',
        categories: battery.map((time)=>time.hour )
      },
      tooltip: {
        x: {
          format: 'HH'
        },
        theme: 'dark',
        style: {
          background: '#222',
          color: '#fff'
        }
      },
    },
          
          
  //     series: [{
  //         name: "chargingenergy",
  //         data:battery.map((val)=>val.chargingenergy),
  //         yaxis: 'yaxis'
  //     },
  //   {
  //     name: "discharging",
  //     data:battery.map((val)=>val.discharging),
  //     yaxis: 'yaxis2'
  //   },
    
  // ],
  //     options: {
  //       chart: {
  //         height: 350,
  //         type: 'area',
  //         zoom: {
  //           enabled: true
  //         }
  //       },
  //       dataLabels: {
  //         enabled: false
  //       },
  //       stroke: {
  //         curve: 'straight'
  //       },
        
  //       labels: battery.map((time)=>time.hour ),
  //       colors: ['#8B0000', '#008FFB'],
  //       // title: {
  //       //   text: 'Product Trends by Month',
  //       //   align: 'left'
  //       // },
  //       // grid: {
  //       //   row: {
  //       //     colors: ['#f3f3f3'], // takes an array which will be repeated on columns
  //       //     opacity: 0.5
  //       //   },
  //       // },
  //       legend:{
  //         show: true,
  //         position: 'bottom',
  //       },
  //       xaxis: {
  //         categories: battery.map((time)=>time.hour )
  //       }
  //     },
  //     yaxis: [
  //       {
  //         id: 'yaxis',
  //         title: {
  //           text: 'Y Axis 1'
  //         }
  //       },
  //       {
  //         id: 'yaxis2',
  //         opposite: true,
  //         title: {
  //           text: 'Y Axis 2'
  //         }
  //       }
  //     ],
  //     tooltip: {
  //       enabled: true,
  //       theme: 'dark',
  //       style: {
  //         background: '#222',
  //         color: '#fff'
  //       }
  //     }
    
  
  
  };
  // setBatterygraph(batterystate)


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
  const now = new Date();
  const local=now.toLocaleString()
  // const formattedDate = now.toLocaleString('en-US', { 
  //   year: 'numeric', 
  //   month: '2-digit', 
  //   day: '2-digit', 
  //   hour: '2-digit', 
  //   minute: '2-digit', 
  //   second: '2-digit', 
  //   hour12: false
  // }).replace('/', '-');
const currentdate=local.split(",")[0]
  
  

      

  return (
    <div   className="main"  style={{ margin:'30px'}} >
  
  <div class="row"  >
  <div class="col-sm-4 mb-3 mb-sm-0">
    <div class="card" style={{width:"100%",marginTop:"5%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}} >
      <div class="card-body" >
        <div >  
        <h5 class="card-title" style={{textAlign:"left",color:"black"}}><b>Building Consumption</b>  </h5>  
        </div>
        
       
        <hr/>
    {/* <div></div> */}
    <p style={{textAlign:"end",color:'black'}}>{currentdate}</p>
<ReactApexChart options={state.options} series={state.series} type="pie" width={'100%'}/>
{/* <br/> */}
<table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
  <tr>
    <td style={{color:"#5e5d5c"}}><b>Wheeled in solar:</b></td>
    <td style={{color:"black", textAlign: 'right'}}>{Math.trunc(totalsolargeneration)}</td>
    <td style={{width: '30px'}}></td>
    <td style={{color:"#5e5d5c"}}><b>Diesel:</b></td>
    <td style={{color:"black", textAlign: 'right'}}>{0}</td>
  </tr>
  <tr>
    <td style={{color:"#5e5d5c"}}><b>Rooftop:</b></td>
    <td style={{color:"black", textAlign: 'right'}}>{Math.trunc(totalrooftopgeneration)}</td>
    <td style={{width: '30px'}}></td>
    <td style={{color:"#5e5d5c"}}><b>Grid:</b></td>
    <td style={{color:"black", textAlign: 'right'}}>{Math.round(gridunprocess)}</td>
  </tr>
</table>
    
      </div>
    </div>
  </div>

  <div class="col-sm-4" >
    <div class="card" style={{width:"auto",height:"96%",marginTop:"5%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
        <h5 class="card-title" style={{color:"black"}}><b>Wheeled In Solar </b><span style={{color:"black",marginLeft:'100px'}}>Status:{statusvalue>=0?<BsIcons.BsBatteryFull color="green" fontSize="1.5em"/>:<BsIcons.BsBatteryFull color="red" fontSize="1.5em"/>}</span></h5> 
        <hr/>
        <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
        <GaugeChart 
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
          
        />
        <br/>
        <br/>
        <br/>
        <br/>
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px',margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Generation (kWh):</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(totalsolargeneration)}</span></td>
  </tr>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Performance %:</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(wheeledinsolarprpercentage)}%</span></td>
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


  <div class="col-sm-4" style={{marginTop:"1.75%"}}>
    <div class="card"  style={{width:"100%", height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
        <h5 class="card-title" style={{color:"black"}}><b> Rooftop Solar </b> <span style={{color:"black",marginLeft:'100px' }}>Status:{statusvalue>=0?<BsIcons.BsBatteryFull color="green" fontSize="1.5em"/>:<BsIcons.BsBatteryFull color="red" fontSize="1.5em"/>}</span></h5>
        <hr/>
        <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
        <GaugeChart 
           id="gauge-chart5"
          nrOfLevels={10}
          colors={["#FF0000","#FF4500","#f9bd00","#9bf400","#008000"]}
          arcsLength={[0.3, 0.3, 0.3,0.3,0.3]}
          arcWidth={0.3}
          percent={Math.trunc(prpercentage)/100}
          needleColor="black"
          textColor="black"
          style={{width:"100",height:"100",alignItems:"center"}}
          
        />
        <br/>
        <br/>
        <br/>
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Generation (kWh):</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(totalrooftopgeneration)}</span></td>
  </tr>
  <tr>
    <td><b style={{color:"#5e5d5c"}}>Performance %:</b></td>
    <td><span style={{color:"black"}}>{Math.trunc(prpercentage)}%</span></td>
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

  


  <div class="col-sm-4" style={{marginTop:"2.25%"}}>
    <div class="card" style={{height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
      <h5 class="card-title"> <b style={{color:"black"}}>Thermal Storage</b></h5> 
      {/*<span style={{color:"black",marginLeft:'100px'}}>Status:</span><BsIcons.BsBatteryFull color="#20B2AA" fontSize="1.5em"/>*/}
        <hr/>
        {/* <Line data={data} options={optionsdata} /> */}
        <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
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

  <div class="col-sm-4" style={{marginTop:"2.25%" }}>
<div class="card" style={{width:"100%",height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
  <div class="card-body">
  <h5 class="card-title"><b style={{color:'black'}}> Chiller Status</b><span style={{color:"black",marginLeft:'100px'}}></span></h5> 
    <hr/>
    <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
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
      <tr>
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
      <tr>
      <td><b style={{color:"black"}}></b></td>
        <td><span>{chillerval2['chiller5'] <= 0.8 || chillerval2['chiller5'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</span></td>
        <td>{chillerval2['chiller6'] === 0 || chillerval2['chiller6'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval2['chiller7'] === 0 || chillerval2['chiller7'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
        <td>{chillerval2['chiller8'] === 0 || chillerval2['chiller8'] === undefined ? <TiWeatherSnow style={{color:"gray",fontSize:'30px'}}/> : <TiWeatherSnow style={{color:"green",fontSize:'30px'}}/>}</td>
      </tr>
    </table>
    
    <div class="card-text"style={{color:"black",font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px',marginTop:"10px" }}> 
      {/* <b style={{color:'black'}}> No.Of cycles: </b>
      <br/>
      <b style={{color:'black'}}>Charging Energy:</b>
      <br/>
      <b style={{color:'black'}}>Discharging Energy:</b> */}

    </div>
  </div>
</div>
</div> 

  


  

  <div class="col-sm-4" style={{marginTop:"2.25%"}}>
    <div class="card" style={{height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
      <h5 class="card-title"><b style={{color:"black"}}>Li-ion Battery</b><span style={{color:"black",marginLeft:'100px' }}>Status:</span> {currentupsStatus ?  <BsIcons.BsBatteryFull color="yellow" fontSize="1.5em"/>:<BsIcons.BsBatteryFull color="green" fontSize="1.5em"/> }</h5> 
        <hr/>
        {/* <Line data={batterychart} options={optionsdata} type="area" height='200px'/>
           <span style={{color:"black"}}>{currentupsStatus[currentupsStatus.length-1]}</span>
        
         */}
        <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
        <div id="chart2"> 
   {
      apexcharts?<ReactApexChart options={apexcharts.options} series={apexcharts.series} type="area" height='270px'/>:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

     
   }
  
   </div>
   {/* <Line data={data} options={optionsdata}/> */}
   {/* <ResponsiveContainer width="100%" height="300px">
        <LineChart
          width={300}
          height={100}
          data={batteryresultdata}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeStamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="batteryEnergy" stroke="red" activeDot={{ r: 8 }}  />
        </LineChart>
      </ResponsiveContainer> */}

{/* 
        <LineChart
          width={480} height={250} 
          data={batteryresultdata}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timeStamp" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="batteryEnergy" stroke="red" activeDot={{ r: 8 }}  />
        </LineChart> */}

{/* <AreaChart width={400} height={250} data={batteryresultdata}
  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
       <stop offset="55%" stopColor="#00C0F0" stopOpacity={0.7}/>
      <stop offset="40%" stopColor="#32cd32" stopOpacity={0.7}/>
    </linearGradient>
  </defs>
  <XAxis dataKey="timeStamp" tickFormatter={formatXAxis}/>
  <YAxis />
  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="batteryEnergy"  fillOpacity={3} fill="url(#colorUv)" activeDot={{ r: 4 }} />
  
   
</AreaChart> */}

   


        <div class="card-text"style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px' }}> 
        {/* <b style={{color:"black"}}>Pack Soc:  {packSoc[packSoc.length-1]}% </b> */}
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
          <tr>
    <td><b style={{color:"#5e5d5c"}}>Pack Soc(%):</b></td>
    <td><span style={{color:"black"}}> {packSoc[packSoc.length-1]}</span></td>
  </tr>
</table>
          <br/>
          {/* <b style={{color:"black"}}>Temparature:</b> */}

        </div>
      </div>
    </div>
  </div>
   
  <div class="col-sm-4">
    <div class="card"  style={{width:"100%", height:"93.6%",marginTop:"6.2%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
        <h4 class="card-title" style={{textAlign:"center",color:"black"}}><b>CO<sub>2</sub> Reduction</b></h4>
        <hr/>
        {/* <p class="card-text">Daily Reduction in Emission:</p> */}
        <p style={{textAlign:"end",color:"black"}}>{currentdate}</p>
        <h5 style={{color:"black",textAlign:"center"}}> Today's CO<sub>2</sub> Reduction:</h5>
       
        <h5 style={{textAlign:"center",color:"black"}}><h5><b>{co2}</b></h5>tCO2/MWh</h5>
        <br/>
        <div style={{textAlign:"center"}}  > 
        {/* <ForestIcon  /> */}

        <img src="https://png.pngtree.com/png-vector/20220518/ourmid/pngtree-flat-template-with-co2-leaves-for-concept-design-png-image_4674847.png" alt="co2" width="200" height="200" style={{ textalign: "center", borderRadius:"100px"}}/>

        </div>
        
        
        
      </div>
    </div>
  </div>



  

 


   <div class="col-sm-4"  style={{marginTop:"2.25%"}}>
     <div class="card" style={{width:"100%", height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
       <div class="card-body">
         <h5 class="card-title" style={{textAlign:"center",color:"black"}}><b>Peak Shavings</b>  </h5>
         
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
         {/* <p> Shavings:</p> */}
       </div>
     </div>
  </div>

  

  
  <div class="col-sm-4"  style={{marginTop:"2.25%",scrollpaddingbottom: '20px'}}>
    <div class="card" style={{width:"100%", height:"100%",background:'linear-gradient(45deg,#d5dbd6,rgba(86, 151, 211, 0.2))',color:"white"}}>
      <div class="card-body">
        <h5 class="card-title"><b style={{color:'black'}}> Wheeled In Wind</b> <span style={{color:"black",marginLeft:'100px' }}>Status:</span><BsIcons.BsBatteryFull color="gray" fontSize="1.5em"/></h5>
        <hr/>
        <GaugeChart 
          id="gauge-chart3"
          nrOfLevels={12}
          colors={["gray"]}
          arcWidth={0.3}
          percent={0}
          textColor={'black'}
          style={{width:"fit-content",height:"100",justifyItems:"center"}}
          
        />
        <div class="card-text"style={{color:"black",font:"icon",fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'17px',marginTop:"10px" }}> 
           Generation(kWh):0
           <br/>
           Wind Speed:0
        </div>
  
      </div>
    </div>
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
  






