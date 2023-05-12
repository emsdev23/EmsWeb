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

const host = "localhost"

function Peakdemandgraphs() {

 
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [data, setData] = useState([]);


const [selectedDate, setSelectedDate] = useState(new Date());
  const [singledaydata,setSingledaydata]=useState([])
 

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };

  const handleDateChange = (singledaydata) => {
    setSelectedDate(singledaydata);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedDate = startDate.toISOString().substring(0, 10);
      const formattedEndDate = endDate.toISOString().substring(0, 10);
      const response = await axios.post('http://localhost:5000/past/hvacSchneider7230Polling', { date: formattedDate, endDate: formattedEndDate });
      if(response.data ==0){
        swal({
          title: "no  matched data found for selected date?",
          text: `check data for different date`,
          icon: "warning",
          buttons: {
            cancel: "Cancel",
            confirm: "OK",
          },
          dangerMode: false,
        })
      }
      else{
        setData(response.data);
      }
     
    } catch (error) {
      console.error(error);
    }
  };


  const handlesingledaySubmit = async (event) => {
    event.preventDefault();
    try {
      const formattedDate = selectedDate.toISOString().substring(0, 10);
      const response = await axios.post('http://localhost:5000/singleday/hvacSchneider7230Polling', { date: formattedDate });
      setSingledaydata(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  console.log(singledaydata)
  //console.log(selectedDate)
  const graphdata=[]
  const singlegrahdata=[]

  for(let i=0;i<data.length;i++){
    const date = new Date(data[i].polledTime);
    let selecteddate = date.toLocaleString();
    let times=selecteddate.split(',')
    // const minutes = date.getMinutes();
    // const ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    graphdata.push({"totalApparentPower2":Math.trunc(data[i].totalApparentPower2), "timeStamp":times, "recordId":data[i].recordId})


    // timeStamp.push(timeString)

  }


  for(let i=0;i<singledaydata.length;i++){
    const date = new Date(singledaydata[i].polledTime);
    let selecteddate = date.toLocaleString();
    let times=selecteddate.split(',')
    // const minutes = date.getMinutes();
    // const ampm = hours >= 12 ? 'pm' : 'am';
    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    // const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    singlegrahdata.push({"totalApparentPower2":Math.trunc(singledaydata[i].totalApparentPower2), "timeStamp":times, "recordId":singledaydata[i].recordId})


    // timeStamp.push(timeString)

  }








console.log(singlegrahdata)



    const batteryurl='http://localhost:5000/battery'
    const acmeterenergy=`http://${host}:5000/acmeterenergy`

    // const navigate = useNavigate();
    // const [data, setData] = useState([]);
 
    // function handleSelect(event) {
    //   const value = event.target.value;
    //   switch (value) {
    //     case '0':
    //         axios.get(batteryurl)
    //         .then(response => {
    //           // Process the data here
    //           setData( response.data);
    //         })
    //         .catch(error => {
    //           console.error(error);
    //         });
    //     //   navigate('/peakdemandgraph?period=yesterday');
    //       break;
    //     case '1':
    //       axios.get(acmeterenergy).then(response => setData(response.data));
    //     //   navigate('/peakdemandgraph?period=week');
    //       break;
    //     case '2':
    //       axios.get('/api/month').then(response => setData(response.data));
    //     //   navigate('/peakdemandgraph?period=month');
    //       break;
    //     default:
    //       break;
    //   }
    // }
    // console.log(data)

    var apexcharts = {
      series: [{
        name:"totalApparentPower2",
        data: graphdata.map((val)=>(val.totalApparentPower2))
      }],
   
      options: {
        chart: {
          type: 'bar'
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: "Peak Demand ",
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
        colors: ['#152138', ' #00FF00'], // Red for positive values, green for negative values
        // colors: ({ value }) => {
        //   return value < 0 ? ['#00ff00'] : ['#ff0000'];
        // },
        xaxis: {
          categories: graphdata.map((time) => time.timeStamp[0]),
          labels: {
            style: {
              colors: 'black' // set the x-axis label color to red
            }
          },
          title : {text:"Date"},
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
          position: 'bottom',
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


 //single days graph
 var apexcharts2 = {
  series: [{
    name:"totalApparentPower2",
    data: singlegrahdata.map((val)=>(val.totalApparentPower2))
  }],

  options: {
    chart: {
      type: 'area'
    },
    dataLabels: {
      enabled: false
    },
    title: {
      text: "Peak Demand ",
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
    colors: ['#152138', ' #00FF00'], // Red for positive values, green for negative values
    // colors: ({ value }) => {
    //   return value < 0 ? ['#00ff00'] : ['#ff0000'];
    // },
    xaxis: {
      categories: singlegrahdata.map((time) => time.timeStamp[1]),
      labels: {
        style: {
          colors: 'black' // set the x-axis label color to red
        }
      },
      title : {text:"Time"},
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
      position: 'bottom',
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


  return (
    <div>
      <div style={{margin:"30px"}}>
      <Link to='/'>
      <button className="btn btn-primary">Back to DashBoard</button>
      </Link>
      </div>
  <Grid sx={{ flexGrow: 1 }} container spacing={2} >
  <Grid item xs={12} sm={6} >
    <form onSubmit={handleSubmit} style={{border:'1px solid black'}} >
      {/* <div class='row' style={{display:'flex'}}>
        <div>  */}
          <div className="row" style={{marginTop:'20px',marginLeft:"10px"}}>
  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          Start Date:
        </label>
      </div>
      <DatePicker id="date" selected={startDate} onChange={handleStartDateChange} />
    </div>
  </div>

  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px" }}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          End Date:
        </label>
      </div>
      <DatePicker selected={endDate} onChange={handleEndDateChange} />
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

<div id="chart2">
<h4 style={{textAlign:'center'}}>{startDate.toISOString().substring(0, 10)} ______ {endDate.toISOString().substring(0, 10)} </h4>

            {/* {data.length > 0 && (

            )} */}
   {
      graphdata?<ReactApexChart options={apexcharts.options} series={apexcharts.series} type='bar' height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

     
   }
 
   </div>
   








   

    </form>
    </Grid>
    <Grid item xs={12} sm={6} >


    <form onSubmit={handlesingledaySubmit}  style={{border:'1px solid black'}} >
      {/* <div class='row' style={{display:'flex'}}>
        <div>  */}
      <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          Select Date:
        </label>
      </div>
      <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
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

<div id="chart2">
<h4 style={{textAlign:'center'}}>{selectedDate.toISOString().substring(0, 10)}</h4>

            {/* {data.length > 0 && (

            )} */}
   {
     
      apexcharts2?<ReactApexChart options={apexcharts2.options} series={apexcharts2.series} type='area' height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

     
   }
 
   </div>
   








   

    </form>
    </Grid>
    </Grid>














   {/*   */}
  </div>
   
  )
}

export default Peakdemandgraphs