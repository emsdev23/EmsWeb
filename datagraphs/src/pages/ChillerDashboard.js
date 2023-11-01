import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

function ChillerDashboard() {
    const host="43.205.196.66"
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
     //declaring empty array to fetch data
    const [thermalStoredwaterTemp,setThermalStoredWaterTemp]=useState([])
    const [chillerLoading,setChillerLoading]=useState([])
    const [thermal_IN_OUT,setThermal_IN_OUT]=useState([])
    const [chillerCop,setChillerCop]=useState([])

    const thermalTempApi=`http://${host}:5000/thermal/storedWaterTemp`
    const chillerLoadingApi="http://localhost:5000/chillerDashboard/ChillerLoading"
    const thermal_IN_OUTApi="http://localhost:5000/chillerDashboard/thermalinletoutlet/condenser/evaporator"
    const chillerCop_Api="http://localhost:5000/chillerDashboard/Average/chillarCOP"
    

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

      
    //-----------chiller Loading ---------------------------//
      useEffect(() => {
        axios.get(chillerLoadingApi)
          .then((res) => {
            const dataResponse = res.data;
            setChillerLoading(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
      //---------------------end--------------------------//

      //--------------------------thermal inlet/outlet --------------------------//
      useEffect(() => {
        axios.get(thermal_IN_OUTApi)
          .then((res) => {
            const dataResponse = res.data;
            setThermal_IN_OUT(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
      //------------------------------end----------------------------------------//

      //----------------------------chiller c1 to c4 cop------------------------------//
      useEffect(() => {
        axios.get(chillerCop_Api)
          .then((res) => {
            const dataResponse = res.data;
            setChillerCop(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);
      //------------------------------------------end--------------------------------------//


console.log(thermalStoredwaterTemp)
console.log(chillerLoading)



const ThermalEvapuratorFlowrate=[]
const ThermalCondenserFlowrate=[]

for(let i=0;i<thermal_IN_OUT.length;i++){
ThermalEvapuratorFlowrate.push(thermal_IN_OUT[i].avg_commonHeaderFlowrate)
ThermalCondenserFlowrate.push(thermal_IN_OUT[i].avg_condenserLineFlowrate)

}

const C1_cop=[]
const C2_cop=[]
const C3_cop=[]
const C4_cop=[]


for(let i=0;i<chillerCop.length;i++){
    C1_cop.push(chillerCop[i].avg_c1cop)
    C2_cop.push(chillerCop[i].avg_c2cop)
    C3_cop.push(chillerCop[i].avg_c3cop)
    C4_cop.push(chillerCop[i].avg_c4cop)

}

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
        categories: chillerLoading.map((chiller1)=>chiller1.polledTime),
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
        valueSuffix: '(%)'
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
            data: chillerLoading.map((chiller1)=>chiller1.c1loading)
        },
        {
            name: 'c2 Loading',
            data: chillerLoading.map((chiller2)=>chiller2.c2loading)
        },
        {
            name: 'c3 Loading',
            data: chillerLoading.map((chiller3)=>chiller3.c3loading)
        },
        {
            name: 'c4 Loading',
            data: chillerLoading.map((chiller4)=>chiller4.c4loading)
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
        categories: thermal_IN_OUT.map((time)=>time.polledTime),
        crosshair: true,
        accessibility: {
            description: 'Countries'
        }
    },
    yAxis: {
        min: 10,
        max: 40,
        title: {
            text: 'Temperature (degrees celsius)'
        },
        //opposite: true, // Display the secondary y-axis on the opposite side of the chart
            //min: 10, // Set the minimum value for the yAxis
             // Set the maximum value for the yAxis
    },
    tooltip: {
        valueSuffix: 'Temperature (degrees celsius)'
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
            name: 'Condenser inlet',
            data:thermal_IN_OUT.map((condenserinlet)=>condenserinlet.avg_condenserLineInletTemp),
            color:'#800080'
        },
        {
            name: 'Condenser outlet',
            data:thermal_IN_OUT.map((condenseroutlet)=>condenseroutlet.avg_condenserLineOutletTemp),
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
        categories:thermal_IN_OUT.map((time)=>time.polledTime),
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
        valueSuffix:'Temperature (degrees celsius)'
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
            data: thermal_IN_OUT.map((evaporatorinlet)=>evaporatorinlet.avg_commonHeaderinletTemp),
            color:'#02ccfe',

        },
        {
            name: 'Evaporator outlet',
            data: thermal_IN_OUT.map((evaporatoroutlet)=>evaporatoroutlet.avg_commonHeaderoutletTemp),
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

    <h2><b>{C1_cop[C1_cop.length-1]}</b></h2>
    <p style={{color:'gray'}}><b>Average of C1 COP</b></p>
  </div>
  <div class="col-6">
    <h2><b>{C2_cop[C2_cop.length-1]}</b></h2>
    <p style={{color:'gray'}} ><b>Average of C2 COP</b></p>
  </div>
  <br/>
  <br/>
  <div class="col-6" style={{marginTop:"20px"}}>
    <h2><b>{C3_cop[C3_cop.length-1]}</b></h2>
    <p style={{color:'gray'}}><b>Average of C3 COP</b></p>
  </div>
  <div class="col-6" style={{marginTop:"20px"}}>
  <h2><b>{C4_cop[C4_cop.length-1]}</b></h2>
<p style={{color:'gray'}}><b>Average of C3 COP</b></p>

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


      <h2><b>{Math.trunc(ThermalEvapuratorFlowrate[ThermalEvapuratorFlowrate.length-1])}</b></h2>
        <p style={{color:"gray"}}><b>Evaporator Flowrate (m<sup>3</sup>/h)</b></p>
        </div>
        <div>
        <h2><b>{Math.trunc(ThermalCondenserFlowrate[ThermalCondenserFlowrate.length-1])}</b></h2>
        <p style={{color:"gray"}}><b>Condenser Flowrate (m<sup>3</sup>/h)</b></p> 
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
