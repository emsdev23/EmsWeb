import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import {Link} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BatteryHourly() {
  const host='121.242.232.211'
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const [battery,setBattery]=useState([])
    const BatteryData=`http://${host}:5000/dashboard/Battery`

    const [selectedDate, setSelectedDate] = useState(null);
    const [singledaydata,setSingledaydata]=useState([])

     //---------function to handle change in inputTag----------------//
     const handleDateChange = (selectedDate) => {
      setSelectedDate(selectedDate);
    };


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


       //------------function to post request according selected date------------------//
       const handlesingledayFilter = async () => {
       
        try {
          const formattedDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : ''
          const response = await axios.post(`http://${host}:5000/dashboard/filtered/Battery`, { date: formattedDate });
          setSingledaydata(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      //--------------------------end of function------------//

       //-------calling the post request function inside the useEffect----------//
       useEffect(()=>{
        handlesingledayFilter()

      },[selectedDate])

      console.log(singledaydata)


      const Packsoc=[]
      const AvailableEnergy=[]
      for(let i=0;i<battery.length;i++){
        Packsoc.push(battery[i].Pacsoc)
        AvailableEnergy.push(battery[i].energy_available)
        //BatteryStatus.push(battery[i].Pacsoc)

      }


     const options= {
        chart: {
            type: 'column',
            zoomType: 'x'
        },
      //   chart: {
         
      // },
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
                    enabled: false, // Enable data labels for the columns
                  },
            },

            // line: {
            //     lineWidth: 2, // Increase the line thickness
            //   },
        },
        series: [{
            name: 'charging  Energy',
            data: battery.map((val)=>val.chargingEnergy),
            type: 'column',
            yAxis: 0, // Primary y-axis,
            color:"#528AAE"
        }, {
            name: 'Discharging  Energy',
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
            min: 0, // Set the minimum value for the yAxis
            max: 100, // Set the maximum value for the yAxis
            },
          ],
    }


    //------------------filtered graph---------------------------------//

    const filteredGraph= {
      chart: {
          type: 'column',
          zoomType: 'x'
      },
    //   chart: {
       
    // },
      title: {
          text:null
      },
      xAxis: {
          categories: singledaydata.map((val)=>val.PolledTime)
      },
      credits: {
          enabled: false
      },
      plotOptions: {
          column: {
              borderRadius: '50%',
              pointWidth: 20,
              dataLabels: {
                  enabled: false, // Enable data labels for the columns
                },
          },

          // line: {
          //     lineWidth: 2, // Increase the line thickness
          //   },
      },
      series: [{
          name: 'charging  Energy',
          data: singledaydata.map((val)=>val.chargingEnergy),
          type: 'column',
          yAxis: 0, // Primary y-axis,
          color:"#528AAE"
      }, {
          name: 'Discharging  Energy',
          data:  singledaydata.map((val)=>val.dischargingEnergy),
          type: 'column',
          yAxis: 0, // Primary y-axis
          color:"#00008B"
      }, {
          name: 'Idle',
          data: singledaydata.map((val)=>val.idleEnergy),
          type: 'column',
          yAxis: 0, // Primary y-axis,
          color:"#FEBE00"
      },
      {
          name: 'packsoc',
          data: singledaydata.map((val)=>val.Pacsoc),
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
            min: 0, // Set the minimum value for the yAxis
            max: 100, // Set the maximum value for the yAxis
          },
        ],
  }


  return (
    <div>
      <div> 
      <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col-10">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b> Date :- </b></h5><DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
        </label>
      </div>
     
    </div>
  </div>
  </div>
      </div>
        <div>
          {
            selectedDate==null? <HighchartsReact highcharts={Highcharts} options={options} height="300px" />: <HighchartsReact highcharts={Highcharts} options={filteredGraph} height="300px" />
          } 
       
        <table style={{font:'caption',fontStretch:"extra-expanded",fontFamily:"serif",fontSize:'20px', margin: '0 auto'}}>
          <tr>
    <td ><b style={{color:"#5e5d5c"}}>Soc(%)</b>:</td>
    <br/>
    <td> </td>
    <td><span style={{color:"black",marginLeft:"10px"}}> {Packsoc[Packsoc.length-1]}</span></td>
    </tr>
    <tr>
    <td><b style={{color:"#5e5d5c"}}>energy  available(kWh):</b></td>
    <br/>
    <br/>
    <td style={{color:"black"}}></td>
    <td><span style={{color:"black",marginLeft:"10px"}}> {AvailableEnergy[AvailableEnergy.length-1]}</span></td>
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
