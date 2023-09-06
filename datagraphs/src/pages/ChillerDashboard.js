import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

function ChillerDashboard() {
    const host="121.242.232.211"
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
     //declaring empty array to fetch data
    const [thermalStoredwaterTemp,setThermalStoredWaterTemp]=useState([])
    const thermalTempApi=`http://${host}:5000/thermal/storedWaterTemp`

    //defining functions for fetching data(get request)

    useEffect(() => {
        axios.get(thermalTempApi)
          .then((res) => {
            const dataResponse = res.data;
            setThermalStoredWaterTemp(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);



    console.log(thermalStoredwaterTemp)

 const options={



    chart: {
        type: 'column'
    },
    title: {
        text: 'Chiller Loading',
        align: 'center',
        style: {
            color: '#cc0000	' // You can replace 'red' with any desired color value
        }
    },
    subtitle: {
        text:
            'Chiller Loading',
        align: 'left'
    },
    xAxis: {
        //categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percentage (%)'
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'C1 Loading',
            data: [0]
        },
        {
            name: 'c2 Loading',
            data: [0]
        },
        {
            name: 'c3 Loading',
            data: [0]
        },
        {
            name: 'c4 Loading',
            data: [0]
        }
    ]
};


const optionsLine={
    chart: {
        type: 'line'
    },
    title: {
        text: 'TS Stored Water Temperature',
        align: 'center',
        style: {
            color: '#cc0000	' // You can replace 'red' with any desired color value
        }
    },
    // subtitle: {
    //     text:
    //         'Chiller Loading',
    //     align: 'left'
    // },
    xAxis: {
        categories: thermalStoredwaterTemp.map((timeStamp)=>timeStamp.polledTime),
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temperature (degrees celsius)'
        }
    },
    tooltip: {
        valueSuffix: '(degrees celsius)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Ts Water temperarture',
            data:  thermalStoredwaterTemp.map((value)=>value.storedwatertemperature)
        },
    ]
};



const optionsTemparature={
    chart: {
        type: 'line'
    },
    title: {
        text: 'Condenser in/out Temperature',
        align: 'left',
        style: {
            color: '#cc0000	' // You can replace 'red' with any desired color value
        }
    },
    // subtitle: {
    //     text:
    //         'Chiller Loading',
    //     align: 'left'
    // },
    xAxis: {
        //categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temperature (degrees celsius)'
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [
        {
            name: 'Condenser inlet',
            data: [0],
            color:'#800080'
        },
        {
            name: 'Condenser outlet',
            data: [0],
            color:"#FB4346"
        },
    ]
};


const optionsEvaporatorTemparature={
    chart: {
        type: 'line'
    },
    title: {
        text: 'Evaporator in/out Temperature',
        align: 'left',
        style: {
            color: '#cc0000	' // You can replace 'red' with any desired color value
        }
    },
    // subtitle: {
    //     text:
    //         'Chiller Loading',
    //     align: 'left'
    // },
    xAxis: {
        //categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temperature (degrees celsius)'
        }
    },
    tooltip: {
        valueSuffix: ' (1000 MT)'
    },
    plotOptions: {
        line: { // Change 'column' to 'line'
            marker: {
                enabled: false // Set this to false to remove markers
            }
        }

    },
    series: [
        {
            name: 'Evaporator inlet',
            data: [0],
            color:'#02ccfe',

        },
        {
            name: 'Evaporator outlet',
            data: [0],
            color:" #1c305c"
        },
    ]
};
  return (
    <div>
        <div> 
        <h3 style={{fontsize:"30px",textAlign:"center"}}><b>Overview of Chiller and its Subsystems</b></h3>
        <br/>
        <br/>
        <div class="container">
  <div class="row">
    <div class="col-4">
       <div > 
       <HighchartsReact highcharts={Highcharts} options={options} />
       </div>
    </div>
    <div class="col-4">
        {/* <div > 
        <HighchartsReact highcharts={Highcharts} options={options} />
        </div> */}
        {/* <div> 
            <h3>(Blank)</h3>
        </div> */}
        <div class="row" style={{marginLeft:"20px"}}>
  <div class="col-6">
    <h2><b>__</b></h2>
    <p style={{color:'gray'}}>Average of C1 COP</p>
  </div>
  <div class="col-6">
    <h2><b>__</b></h2>
    <p style={{color:'gray'}} > Average of C2 COP</p>
  </div>
  <br/>
  <br/>
  <div class="col-6" style={{marginTop:"20px"}}>
    <h2><b>__</b></h2>
    <p style={{color:'gray'}}>Average of C3 COP</p>
  </div>
  <div class="col-6" style={{marginTop:"20px"}}>
  <h2><b>__</b></h2>
<p style={{color:'gray'}}>Average of C3 COP</p>

  </div>
  {/* <div class="col">col</div>
  <div class="col">col</div>
  <div class="col">col</div> */}
  </div>
  <br/>
  <div> 
     <h2 style={{textAlign:'center'}}><b>CT Performance</b></h2>
     <div style={{marginLeft:"30px",marginTop:"20px"}}> 
     <p><b>C1:</b></p>
     <p><b>C2:</b></p>
     <p><b>C3:</b></p>
     <p><b>C4:</b></p>

     </div>
    

  </div>
   
    </div>
    <div class="col-4">
    <div> 
    <HighchartsReact highcharts={Highcharts} options={optionsLine} />
    </div>
   
    </div>
  </div>
</div>
<br/>
<br/>

<div class="container">
  <div class="row">
    <div class="col-4">
       <div> 
       <HighchartsReact highcharts={Highcharts} options={optionsTemparature}  />
       </div>
    </div>
    <div class="col-4">
      <div style={{textAlign:"center"}}> 
      <div> 
      <h2><b>__</b></h2>
        <p style={{color:"gray"}}>Average of Evaporator Flowrate</p>
        </div>
        <div>
        <h2><b>__</b></h2>
        <p style={{color:"gray"}}>Average of Condenser Flowrate</p> 
        </div>
        
      </div>
    </div>
    <div class="col-4">
    <HighchartsReact highcharts={Highcharts} options={optionsEvaporatorTemparature}  />
    
    </div>
  </div>
</div>
        </div>

        
     
    </div>
  )
}

export default ChillerDashboard
