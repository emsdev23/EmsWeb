import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import {Link} from 'react-router-dom';

function BatteryHourly() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const [battery,setBattery]=useState([])
    const BatteryData="http://localhost:5000/dashboard/Battery"


    useEffect(() => {
        axios.get(BatteryData)
          .then((res) => {
            const dataResponse = res.data;
            setBattery(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);


      const Packsoc=[]
      const AvailableEnergy=[]
      for(let i=0;i<battery.length;i++){
        Packsoc.push(battery[i].Pacsoc)
        AvailableEnergy.push(battery[i].energy_available)
        //BatteryStatus.push(battery[i].Pacsoc)

      }


     const options= {
        chart: {
            type: 'column'
        },
        title: {
            text:null
        },
        xAxis: {
            categories: battery.map((val)=>val.PolledTime)
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            column: {
                borderRadius: '50%',
                pointWidth: 20,
                dataLabels: {
                    enabled: true, // Enable data labels for the columns
                  },
            },

            // line: {
            //     lineWidth: 2, // Increase the line thickness
            //   },
        },
        series: [{
            name: 'chargingEnergy',
            data: battery.map((val)=>val.chargingEnergy),
            type: 'column',
            yAxis: 0, // Primary y-axis,
            color:"#528AAE"
        }, {
            name: 'DischargingEnergy',
            data:  battery.map((val)=>val.dischargingEnergy),
            type: 'column',
            yAxis: 0, // Primary y-axis
            color:"#00008B"
        }, {
            name: 'Idle',
            data: battery.map((val)=>val.idleEnergy),
            type: 'column',
            yAxis: 0, // Primary y-axis,
            color:"#FEBE00"
        },
        {
            name: 'packsoc',
            data: battery.map((val)=>val.Pacsoc),
            type: 'line',
            color:"#FF6666",
            yAxis: 1, // Primary y-axis
        }],
        yAxis: [
            {
              title: {
                text: "Energy (kWh)",
              },
            },
            {
              title: {
                text: "SoC(%)",
              },
              opposite: true, // Display the secondary y-axis on the opposite side of the chart
            },
          ],
    }


  return (
    <div>
        <div> 
        <HighchartsReact highcharts={Highcharts} options={options} height="300px" />
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
          <tr>
    <td><b style={{color:"#5e5d5c"}}>Pack Soc(%):</b></td>
    <td><span style={{color:"black"}}> {Packsoc[Packsoc.length-1]}</span></td>
    </tr>
    <tr>
    <td><b style={{color:"#5e5d5c"}}>energy_available:</b></td>
    <td><span style={{color:"black"}}> {AvailableEnergy[AvailableEnergy.length-1]}</span></td>
   </tr>
   
</table>

        </div>
        <div style={{ color: '#5e5d5c', textAlign: 'right', fontSize: "22px"}}> 
         <Link to='/Battery_Analytics'>
         <button type="button" class="btn btn-outline-success">Explore</button>
      </Link> 
 
       

</div>
        
      
    </div>
  )
}

export default BatteryHourly
