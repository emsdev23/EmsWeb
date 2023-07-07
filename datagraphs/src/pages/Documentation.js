import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { BsFillCircleFill } from "react-icons/bs";
import CircularProgress from '@mui/material/CircularProgress';

function Documentation() {
  
  const voltage="http://localhost:5000/analytics/battery/voltage&current"
  const [graphData, setGraphData] = useState([]);
  const [voltcurrent,setVoltcurrent]=useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/analytics/battery')
      .then((res) => {
        const dataResponse = res.data;
        setGraphData(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get(voltage)
      .then((res) => {
        const dataResponse = res.data;
        setVoltcurrent(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  var Voltagecurrent = {
    series: [{
      name:"Voltage(V)",
      data: voltcurrent.map((val)=>(val.batteryVoltage)),
      yAxis: 1,
      type:"line"
    },
    {
      name:"Current(A)",
      data: voltcurrent.map((val)=>(val.batteryCurrent)),
      yAxis: 0,
      type:"area"
    }
 
  ],
 
    options: {
      chart: {
        type: 'area',
        zoom: {
                  enabled: true
                }
      },
      dataLabels: {
        enabled: false
      },
      title: {
        // text: "Wheeled In Solar",
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        },
    },
      stroke: {
        curve: 'straight'
      },
      // colors: ['#152138', ' #00FF00'], // Red for positive values, green for negative values
      // colors: ({ value }) => {
      //   return value < 0 ? ['#00ff00'] : ['#ff0000'];
      // },
      // yaxis: {
      //   title: {
      //     text: 'Active Power (kW)',
      //   }
      // },
      yaxis: [
        {
          title: {
            text: 'Voltage(V)'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Current(A)'
          }
        }
      ],
      xaxis: {
        categories: voltcurrent.map((val)=>(val.timestamp)),
        labels: {
          style: {
            colors: 'white' // set the x-axis label color to red
          }
        },
        title : {text:"Time Interval in  1  Min"},
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
      plotOptions: {
        bar: {
          colors: {
            ranges: [{
              from: -9999,
              to: 0,
              color: '#F15B46'
            }, {
              from: 0,
              to: 9999,
              color: '#28abf7'  
            }]
          },
          columnWidth: '80%',
        }
      },
      fill:{
        target:"origin",
        below:'#00FF7F',
        above:'#20B2AA'
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: '#fff'
        }
      },
      legend:{
        show: true,
        position: 'top',
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
}
  

const timeLimit=[]

  var apexcharts2 = {
    series: [   {
      name: "Energy(kWh)",
      data: graphData.map((val) => val.batteryEnergy),
      yAxis: 1,
      type: "area",
      color:'#9ACCFB'
      // fill: {
      //   // colors: ({ value }) => {
      //   //   return value < 0 ? '#12239E' : '#0000FF';
      //   // },]
      //     color:'#12239e'
      // },
      // stroke: {
      //   colors: ({ value }) => {
      //     return value < 0 ? '#FF0000' : '#0000FF';
      //   },
      // },
    },
    {
      name: "SoC(%)",
      data: graphData.map((val) => val.packsoc),
      yAxis: 0,
      type: "line",
      color: '#FFA500', // Change the color of the "Packsoc" line graph
    },

 
  ],
 
    options: {
      chart: {
        type: 'area',
        zoom: {
          enabled: true,
          autoScaleYaxis: true, // Set autoScaleYaxis to true for zoom option on the left side
        },
        // Rest of your chart configuration
      },
  
      stroke: {
        width: 3, // Adjust the thickness of the line here
      },
      
      // dataLabels: {
      //   enabled: false,
      //   style: {
      //     fontSize: '10px', // Reduce the font size of the data labels
      //     colors: ['#000000'], // Change the color of the data labels
      //   },
      // },
      dataLabels: {
        enabled:false,
        enabledOnSeries: [1],
        style:{
          fontSize: '9px',
          colors: ['#FF6347'],
        }
      },
      title: {
        // text: "Wheeled In Solar",
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize:  '14px',
          fontWeight:  'bold',
          fontFamily:  undefined,
          color:  '#263238'
        },
    },
      // colors: ['#152138', ' #00FF00'], // Red for positive values, green for negative values
      // colors: ({ value }) => {
      //   return value < 0 ? ['#00ff00'] : ['#ff0000'];
      // },
      // yaxis: {
      //   title: {
      //     text: 'Active Power (kW)',
      //   }
      // },
      yaxis: [
        {
          title: {
            text: 'Energy (kWh)'
          }
        },
        {
          opposite: true,
          title: {
            text: 'SoC(%)'
          },
          labels: {
            show: true, // Remove data labels for "Packsoc" line chart
          }
        }
      ],
      xaxis: {
        categories: graphData.map((time) => time.timestamp),
        labels: {
          style: {
            colors: 'white' // set the x-axis label color to red
          }
        },
        title : {text:"Time Interval in  5 Min"},
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
      plotOptions: {
        // bar: {
        //   colors: {
        //     ranges: [{
        //       from: -9999,
        //       to: 0,
        //       color: '#234F1E'
        //     }, {
        //       from: 0,
        //       to: 9999,
        //       color: '#28abf7'  
        //     }]
        //   },
        //   columnWidth: '100%',
        // },
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'bottom'
          }
        },
        line: {
          dataLabels: {
            enabled: false,
            style: {
              fontSize: '10px', // Reduce the font size of the data labels
              colors: ['#000000'], // Change the color of the data labels
            },
          },
        },
  
      },
      fill:{
        target:"origin",
        below:'#00FF7F',
        above:'#20B2AA'
      },
      // tooltip: {
      //   enabled: true,
      //   theme: 'dark',
      //   style: {
      //     background: '#222',
      //     color: '#fff'
      //   }
      // },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: '#fff'
        },
        y: {
          formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
            if (seriesIndex === 1) {
              return `${value} (Packsoc)`;
            }
            if (value === 0) {
              return `${value} (Idle)`;
            } else if (value > 0) {
              return `${value} (Charging Energy)`;
            } else {
              return `${value} (Discharging Energy)`;
            }
          }
        }
      },
  
      legend:{
        show: true,
        position: 'top',
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
}
  
  
  const now = new Date();
  const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
  const [month, day, year] = local.split("/"); // Split the date by "/"
  const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month

  return (
    <div> 
      <div style={{textAlign:"center",margin:"20px",color:"black"}}> <h2><b>48 kWh UPS Battery</b></h2></div>
      {/* <div> 
      <h4 style={{textAlign:"end",color:"black",marginTop:"20px"}}><b>{currentdate}</b></h4>
      </div> */}
     
      {/* <div class="data-container-legends" style={{marginLeft:"30%"}}>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#FFAE42'/> &nbsp; <b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Idle</b> </span>
    </span>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#0000FF'/> &nbsp;<b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Charging Energy</b> </span>

    </span>
    <span>
    <span style={{ color: '#5e5d5c' }}><BsFillCircleFill color='#00FF00'/>&nbsp;<b style={{ color: 'black', textAlign: 'right',fontSize:"18px"}}>Discharging Energy</b> </span>  

    </span>
    <span>
    
    </span>
  </div> */}
  <br/>
  <div>
    <h4 style={{textAlign:"center"}}><b>Daily Energy cycle v/s SoC</b> <b style={{marginLeft:"100px",textAlign:"end"}}>{currentdate}</b> </h4>
  </div>
  <div> 
  <ReactApexChart options={apexcharts2.options} series={apexcharts2.series}  height="360px" />
  </div>
  <hr style={{border:"10px solid black"}}/>

  <div>
    <h4 style={{textAlign:"center"}}><b>Voltage  v/s Current</b> </h4>
  </div>
  <div> {
    
  Voltagecurrent?<ReactApexChart options={Voltagecurrent.options} series={Voltagecurrent.series} type='area' height='360px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>
}
  </div>
          
    </div>
    
  );
}


export default Documentation
