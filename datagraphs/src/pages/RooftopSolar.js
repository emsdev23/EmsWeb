import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import ReactApexChart from 'react-apexcharts';
import CircularProgress from '@mui/material/CircularProgress';
import swal from 'sweetalert';
import Grid from '@mui/material/Grid';
import { Link } from "react-router-dom";


function RooftopSolar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [singledaydata,setSingledaydata]=useState([])
    const handleDateChange = (singledaydata) => {
        setSelectedDate(singledaydata);
      };
      const handlesingledaySubmit = async (event) => {
        event.preventDefault();
        try {
          const formattedDate = selectedDate.toISOString().substring(0, 10);
          const response = await axios.post('http://121.242.232.211:5000/roofTopHourly', { date: formattedDate });
          setSingledaydata(response.data);
        } catch (error) {
          console.error(error);
        }
      };

      console.log(singledaydata)
      var apexcharts2 = {
        series: [{
          name:"energy",
          data: singledaydata.map((val)=>(val.energy))
        },
        {
          name:"solar_radiation",
          data: singledaydata.map((val)=>(val.solarRadiation))
        }
     
      ],
     
        options: {
          chart: {
            type: 'area'
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
          yaxis: {
            title: {
              text: 'Active Power (kW)',
            }
          },
          xaxis: {
            categories: singledaydata.map((val)=>(val.timestamp)),
            labels: {
              style: {
                colors: 'black' // set the x-axis label color to red
              }
            },
            title : {text:"Time in HOURS"},
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
  return (
    <div>
        <div>
      <div>
      <h4 style={{textAlign:'center',marginTop:"15px"}}><b>RoofTop Solar </b></h4>
      </div>
       <form onSubmit={handlesingledaySubmit}  style={{border:'1px solid black'}} >
      {/* <div class='row' style={{display:'flex'}}>
        <div>  */}
      <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b>Select Date </b></h5>:<DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
        </label>
      </div>
     
    </div>
  </div>

 
</div>
        {/* <div class="input-group mb-3"  style={{width:"300px",marginTop:"50px"}}>
       
         
        </div> */}
        {/* </div>
      </div> */}
       
        <button type="submit" class="btn btn-danger btn-lg" style={{height:"40px"}}>View Data</button>

{/*      
      <label htmlFor="date">Select a date:</label>
      <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
      <button type="submit">Filter Data</button> */}

{/* <div>
  <h4>  <span>{startDate}</span> to  <span>{endDate}</span></h4>
</div> */}
{/* <h4 style={{textAlign:"center",color:"brown"}}><b>Inverter Active Power</b></h4> */}

<div id="chart2">


            {/* {data.length > 0 && (

            )} */}
   {
     
      apexcharts2?<ReactApexChart options={apexcharts2.options} series={apexcharts2.series} type='area' height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

     
   }
 
   </div>
   </form>
    </div>
    </div>
  )
}

export default RooftopSolar
