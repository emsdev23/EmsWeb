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


function WheeledInsolar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [singledaydata,setSingledaydata]=useState([])
    const [wmsMeterdata,setWmsMeterdata]=useState([])
  
    
    const handleDateChange = (singledaydata) => {
      setSelectedDate(singledaydata);
    };
  
    const handlesingledaySubmit = async (event) => {
      event.preventDefault();
      try {
        const formattedDate = selectedDate.toISOString().substring(0, 10);
        const response = await axios.post('http://121.242.232.211:5000/singleday/wheeledinsolr', { date: formattedDate });
        const meterresponse = await axios.post('http://121.242.232.211:5000/wmsMeter/graphs', { date: formattedDate });
        
        setSingledaydata(response.data);
        setWmsMeterdata(meterresponse.data)
      } catch (error) {
        console.error(error);
      }
    };
  
    const graphdata=[]
    const singlegrahdata=[]
     let  INV1=[]
    var INV2=[]
    var INV3=[]
    var INV4=[]
    var INV5=[]
    var INV6=[]
    var INV7=[]
    var INV8=[]
   

    const inverterOne=[]
    const inverterTwo=[]
    const inverterThree=[]
    const inverterFour=[]
    const inverterFive=[]
    const inverterSix=[]
    const inverterSeven=[]
    const inverterEight=[]

    
    
  for(let i=0;i<singledaydata.length;i++){
    INV1.push(singledaydata[i].INV1)
    INV2.push(singledaydata[i].INV2)
    INV3.push(singledaydata[i].INV3)
    INV4.push(singledaydata[i].INV4)
    INV5.push(singledaydata[i].INV5)
    INV6.push(singledaydata[i].INV6)
    INV7.push(singledaydata[i].INV7)
    INV8.push(singledaydata[i].INV8)
    const inverter1=INV1[0]
    for (let i = 0; i < inverter1.length; i++) {
      inverterOne.push(inverter1[i])
    }
    const inverter2=INV2[0]
    for(let i=0;i<inverter2.length;i++){
      inverterTwo.push(inverter2[i])

    }
    const inverter3=INV3[0]
    for(let i=0;i<inverter3.length;i++){
      inverterThree.push(inverter3[i])

    }

    const inverter4=INV4[0]
    for(let i=0;i<inverter4.length;i++){
      inverterFour.push(inverter4[i])

    }

    const inverter5=INV5[0]
    for(let i=0;i<inverter5.length;i++){
      inverterFive.push(inverter5[i])

    }
    const inverter6=INV6[0]
    for(let i=0;i<inverter6.length;i++){
      inverterSix.push(inverter6[i])

    }

    const inverter7=INV7[0]
    for(let i=0;i<inverter7.length;i++){
      inverterSeven.push(inverter7[i])

    }
    const inverter8=INV8[0]
    for(let i=0;i<inverter8.length;i++){
      inverterEight.push(inverter8[i])

    }
    for(let i=0;i<inverter1.length;i++){
      const date = new Date(inverter1[i].invertertimestamp);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const timestamp = `${hours}:${minutes}`;
       // Splitting the time into hours and minutes
       var [converthours, convertminutes] = timestamp.split(":");

       // Converting the hours and minutes to integers
        var parsehours = parseInt(converthours, 10);
        var parseminutes = parseInt(convertminutes, 10);

    // Rounding off the time
    if (parseminutes >= 30) {
     parsehours += 1;
       }

// Formatting the rounded time
var roundedTime = parsehours.toString().padStart(2, "0") + ":00";
      graphdata.push({"inverterTimestamp":roundedTime})
    }
  
   
    
    // const minutes = date.getMinutes();
    // const ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
   


    // timeStamp.push(timeString)

  }
  handlesingledaySubmit()
  console.log(singledaydata)
  console.log(graphdata)
  
  console.log(wmsMeterdata)



  var apexcharts2 = {
    series: [{
      name:"INV1",
      data: inverterOne.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV2",
      data: inverterTwo.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV3",
      data: inverterThree.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV4",
      data: inverterFour.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV5",
      data: inverterFive.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV6",
      data: inverterSix.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV7",
      data: inverterSeven.map((val)=>(val.cumulativeactivepower))
    },
    {
      name:"INV8",
      data: inverterEight.map((val)=>(val.cumulativeactivepower))
    },
  
  ],
  
    options: {
      chart: {
        type: 'line',
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: false
      },
      zoom: {
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
        categories: graphdata.map((val)=>(val.inverterTimestamp)),
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
  };

  var wmsMetergraph = {
    series: [
      {
        name: "Energy",
        data: wmsMeterdata.map((val) => (val.instantaniousEnergy)),
        yAxis: 1
      },
      {
        name: "Irradiation (kWh/m2)",
        data: wmsMeterdata.map((val) => val.wmsirradiation),
        yAxis: 0
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
        align: 'center',
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: undefined,
          color: '#263238'
        }
      },
      yaxis: [
        {
          title: {
            text: 'Energy (kW)'
          }
        },
        {
          opposite: true,
          title: {
            text: 'Irradiation (kWh/m2)'
          }
        }
      ],
      xaxis: {
        categories: wmsMeterdata.map((val) => val.timestamp),
        labels: {
          style: {
            colors: 'black'
          }
        },
        title: { text: 'Time in HOURS' }
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
            ranges: [
              {
                from: -9999,
                to: 0,
                color: '#F15B46'
              },
              {
                from: 0,
                to: 9999,
                color: '#28abf7'
              }
            ]
          },
          columnWidth: '80%'
        }
      },
      fill: {
        target: 'origin',
        below: '#00FF7F',
        above: '#20B2AA'
      },
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: '#fff'
        }
      },
      legend: {
        show: true,
        position: 'top'
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
      }
    }
  };
  
  return (
    <div>
      <div> 
      <h4 style={{textAlign:'center',marginTop:"15px"}}><b style={{fontSize:"30px"}}>Wheeled In Solar </b></h4>
      </div>
       <form onSubmit={handlesingledaySubmit}   >
      {/* <div class='row' style={{display:'flex'}}>
        <div>  */}
         {/* <Grid sx={{ flexGrow: 1 }} container spacing={2} >
  <Grid item xs={12} sm={6} ></Grid> */}
    <div className="row" style={{ marginLeft: "20px", marginTop: "10px" }}>
  <div className="col">
    <div className="input-group mb-4" style={{ display: "flex" }}>
      
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h5 style={{color:"brown"}}><b>Select Date :</b></h5> <DatePicker id="date" className="form-control" selected={selectedDate} onChange={handleDateChange} style={{ width: "200px" }}   />
        </label>
       
      
     
    </div>
  </div>
</div>

        {/* <div class="input-group mb-3"  style={{width:"300px",marginTop:"50px"}}>
       
         
        </div> */}
        {/* </div>
      </div> */}
       
        <button type="submit" class="btn btn-danger btn-lg" style={{height:"40px",marginTop:"10px",marginLeft:"30px"}}>View Data</button>



   </form>
   <Grid sx={{ flexGrow: 1 }} container spacing={2} >

   <Grid item xs={12} sm={6} >
    <div> 
    <h4 style={{textAlign:"center",color:"brown"}}><b>Daily Solar data</b></h4>
   {
     
     wmsMetergraph?<ReactApexChart options={wmsMetergraph.options} series={wmsMetergraph.series} type='area' height='400px' />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

    
  }
    </div>
    </Grid>

  <Grid item xs={12} sm={6} > 
  <div id="chart2">
  <h4 style={{textAlign:"center",color:"brown"}}><b>Inverter Active Power</b></h4>
{

apexcharts2?<ReactApexChart options={apexcharts2.options} series={apexcharts2.series} type='line' height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>


}

</div>
</Grid>
  
   
    </Grid>
  
    
  


  
   

    </div>
  )
}

export default WheeledInsolar
