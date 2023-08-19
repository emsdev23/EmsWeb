import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

function ChillerDashboard() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
     //declaring empty array to fetch data
    const [thermalStoredwaterTemp,setThermalStoredWaterTemp]=useState([])
    const thermalTempApi="http://localhost:5000/thermal/storedWaterTemp"

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
        categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
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
            data: [406292, 260000, 107000, 68300, 27500, 14500,406292, 260000, 107000, 68300, 27500, 14500,406292, 260000, 107000, 68300, 27500, 14500,406292, 260000, 107000, 68300, 27500, 14500,406292]
        },
        {
            name: 'c2 Loading',
            data: [51086, 136000, 5500, 141000, 107180, 77000,51086, 136000, 5500, 141000, 107180, 77000,51086, 136000, 5500, 141000, 107180, 77000,51086, 136000, 5500, 141000, 107180, 77000]
        },
        {
            name: 'c3 Loading',
            data: [51086, 136000, 5500, 141000, 107180, 77000]
        },
        {
            name: 'c4 Loading',
            data: [51086, 136000, 5500, 141000, 107180, 77000]
        }
    ]
};


const optionsLine={
    chart: {
        type: 'line'
    },
    title: {
        text: 'TS Stored Water Temparature',
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
            text: 'Temparature (degrees celsius)'
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
            name: 'Ts Water tempararture',
            data:  thermalStoredwaterTemp.map((value)=>value.storedwatertemperature)
        },
    ]
};



const optionsTemparature={
    chart: {
        type: 'line'
    },
    title: {
        text: 'Condenser in/out Temparature',
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
        categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temparature (degrees celsius)'
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
            data: [10, 18, 16, 6, 27, 45,62, 26, 70, 68, 50, 15,29, 20, 70, 30, 27, 14,92, 26, 100, 30, 50, 45,92],
            color:'#800080'
        },
        {
            name: 'Condenser outlet',
            data: [92, 60, 70, 30, 75, 45,92, 26, 17, 68, 27, 45,62, 26, 70, 68, 50, 14,46, 26, 17, 68, 75, 15,29],
            color:"#FB4346"
        },
    ]
};


const optionsEvaporatorTemparature={
    chart: {
        type: 'line'
    },
    title: {
        text: 'Evaporator in/out Temparature',
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
        categories: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23],
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Temparature (degrees celsius)'
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
            data: [11,19,21,23,25,13,15,17,27,51,53,55,57,29,35,37,31,33,39,41,43,45,47,49,],
            color:'#02ccfe',

        },
        {
            name: 'Evaporator outlet',
            data: [92, 60, 70, 30, 75, 45,92, 26, 17, 68, 27, 45,62, 26, 70, 68, 50, 14,46, 26, 17, 68, 75, 15,29],
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
    <h2><b>3.76</b></h2>
    <p style={{color:'gray'}}>Average of C1 COP</p>
  </div>
  <div class="col-6">
    <h2><b>3.36</b></h2>
    <p style={{color:'gray'}} > Average of C2 COP</p>
  </div>
  <br/>
  <br/>
  <div class="col-6" style={{marginTop:"20px"}}>
    <h2><b>3.64</b></h2>
    <p style={{color:'gray'}}>Average of C3 COP</p>
  </div>
  <div class="col-6" style={{marginTop:"20px"}}>
  <h2><b>3.64</b></h2>
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
      <h2><b>54.98</b></h2>
        <p style={{color:"gray"}}>Average of Evaporator Flowrate</p>
        </div>
        <div>
        <h2><b>54.18</b></h2>
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
