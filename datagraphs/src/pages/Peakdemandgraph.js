import React, { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactApexChart from 'react-apexcharts';


const host = "http://121.242.232.211:5000/peak/hvacSchneider7230Polling"

function Peakdemandgraphs() {

 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);


  const [initialGraph,setInitialGraph]=useState([])
 

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
  setEndDate(date);
};

const handleSubmit = (event) => {
  event.preventDefault();
  fetchData();
};


const CurrentGraph=()=>{
  axios.get(host).then((res)=>{
    const dataresponse=res.data
    setInitialGraph(dataresponse)
   
  }).catch((err)=>{
    console.log(err)
  })
}

  // const handleDateChange = (singledaydata) => {
  //   setSelectedDate(singledaydata);
  // };


  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const formattedDate = startDate.toISOString().substring(0, 10);
  //     const formattedEndDate = endDate ? endDate.toISOString().substring(0, 10) : '';
  
  //     const response = await axios.post('http://localhost:5000/filter/hvacSchneider7230Polling', { date: formattedDate, endDate: formattedEndDate });
  
  //     setData(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      const formattedEndDate = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
  
      const response = await axios.post('http://121.242.232.211:5000/filter/hvacSchneider7230Polling', {
        date: formattedStartDate,
        endDate: formattedEndDate
      });
    
      setData(response.data);
      setLoading(false);
      console.log(formattedStartDate,formattedEndDate)
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

useEffect(() => {
  fetchData();
  


}, [startDate, endDate]);

useEffect(()=>{
  CurrentGraph()
},[])

console.log(startDate,endDate)
console.log(initialGraph)

  // const handlesingledaySubmit = async (event) => {
  //   event.preventDefault();
  //   try {
  //     const formattedDate = selectedDate.toISOString().substring(0, 10);
  //     const response = await axios.post('http://localhost:5000/singleday/hvacSchneider7230Polling', { date: formattedDate });
  //     setSingledaydata(response.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };


  // console.log(singledaydata)
  //console.log(selectedDate)
  const graphdata=[]
  const singlegrahdata=[]

  // for(let i=0;i<data.length;i++){
  //   const date = new Date(data[i].polledTime);
  //   let selecteddate = date.toLocaleString();
  //   let times=selecteddate.split(',')
  //   // const minutes = date.getMinutes();
  //   // const ampm = hours >= 12 ? 'pm' : 'am';
  //   // hours = hours % 12;
  //   // hours = hours ? hours : 12; // the hour '0' should be '12'
  //   // const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
  //   graphdata.push({"totalApparentPower2":Math.trunc(data[i].totalApparentPower2), "timeStamp":times, "recordId":data[i].recordId})


  //   // timeStamp.push(timeString)

  // }


  // for(let i=0;i<singledaydata.length;i++){
  //   const date = new Date(singledaydata[i].polledTime);
  //   let selecteddate = date.toLocaleString();
  //   let times=selecteddate.split(',')
  //   // const minutes = date.getMinutes();
  //   // const ampm = hours >= 12 ? 'pm' : 'am';
  //   // hours = hours % 12;
  //   // hours = hours ? hours : 12; // the hour '0' should be '12'
  //   // const timeString = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
  //   singlegrahdata.push({"totalApparentPower2":Math.trunc(singledaydata[i].totalApparentPower2), "timeStamp":times, "recordId":singledaydata[i].recordId})


  //   // timeStamp.push(timeString)

  // }








// console.log(singlegrahdata)



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

    // condintion for x-axis filter according to the single day "HH:MM" and for date range "MM:DD:YYYY"
    const xAxisFormat = startDate && endDate ?  data.map((val)=>val.timestamp[0]) : data.map((val)=>val.timestamp[1]);
    const graphChange = startDate && endDate ?  "bar": "area";
    
    console.log(xAxisFormat)
  

    var apexcharts = {
      series: [{
        name: "totalApparentPower2",
        data: data.map((val) => (val.peakdemand))
      }],
    
      options: {
        chart: {
          type: graphChange,
          zoom: {
            enabled: false
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
          },
        },
    
        yaxis: {
          title: {
            text: 'Apparent Power (kVA)',
          }
        },
        xaxis: {
          categories: xAxisFormat,
          labels: {
            style: {
              colors: 'black' // set the x-axis label color to black
            }
          },
          title: { text: "Date" },
        },
    
        plotOptions: {
          area: {
            fillTo: 'end',
            opacity: 0.8,
            markers: {
              size: 0
            }
          }
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
          position: 'bottom',
        },
        fill: {
          type: 'solid',
          colors: ['#008FFB'],
          opacity: 0.8,
          gradient: {
            shade: 'light',
            type: 'horizontal',
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 100],
          },
        },
        stroke: {
          show: true,
          colors: ['#008FFB'],
          width: 2,
          dashArray: [0],
        },
      }
    };
    
    // Update stroke dash array based on data limit
    if (data.some((point) => point.y >= 3900)) {
      apexcharts.options.stroke.dashArray = [5];
    }
    const apexchartsOptions = {
      series: [{
        name:"totalApparentPower2",
        data: data.map((val)=>(val.peakdemand))
      }], 
      
      chart: {
        type: 'area',
        height: '400px',
        zoom: {
          enabled: false
        }
      },
      xaxis: {
        type: 'category',
        labels: {
          format: xAxisFormat,
        },
      },
      fill: {
        type: 'solid',
        colors: ['#008FFB'],
        opacity: 0.8,
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 100],
        },
      },
      stroke: {
        show: true,
        colors: ['#008FFB'],
        width: 2,
        dashArray: [0],
      },
    };
  
    // Update stroke dash array based on data limit
    if (data.some((point) => point.y >= 3900)) {
      apexchartsOptions.stroke.dashArray = [5];
    }




 //single days graph
 var apexcharts2 = {
  series: [{
    name:"totalApparentPower2",
    data: initialGraph.map((val)=>(val.peakdemand))
  }],

  options: {
    chart: {
      type: 'area',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    title: {
      // text: "Peak Demand ",
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
    yaxis: {
      title: {
        text: 'Apparent Power (kVA)',
      }
    },
    xaxis: {
      categories: initialGraph.map((time) => time.polledTime),
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
  
  }
};


const curdGraph= startDate || endDate ?  apexcharts: apexcharts2;
const testing = startDate || endDate ?  "selected graph executed": "current date graph executed";
console.log(testing)



  return (
    <div>
      <div>
    <form onSubmit={handleSubmit}>
      {/* <DatePicker selected={startDate} onChange={handleStartDateChange} placeholderText="Select start date" />
      <DatePicker selected={endDate} onChange={handleEndDateChange} placeholderText="Select end date" />
      <button type="submit">Submit</button> */}
      <br/>
      <br/>

      <div className="row" style={{marginTop:'20px',marginLeft:"10px"}}>
  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown"}}><b>Start Date :</b></h6> <DatePicker id="date" selected={startDate} onChange={handleStartDateChange} placeholderText='select date' />
        </label>
      </div>
     
    </div>
  </div>

  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px" }}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown"}}><b>End Date :</b></h6> <DatePicker selected={endDate} onChange={handleEndDateChange} placeholderText='select date' />
        </label>
      </div>
     
    </div>
  </div>
</div>
    </form>

    {loading ? (
      <div>Loading...</div>
    ) : (
      <div>
        <ReactApexChart options={curdGraph.options} series={curdGraph.series} type={graphChange} height="400px" />
      </div>
    )}
  </div>

    </div>
   
  )
}

export default Peakdemandgraphs










// <Grid sx={{ flexGrow: 1 }} container spacing={2} >
// <Grid item xs={12} sm={6} >
// <h3 style={{textAlign:'center',color:"brown"}}> <b>Peak Demand (kVA)</b></h3>
  
//   </Grid>
//   <Grid item xs={12} sm={6} >
//   <h3 style={{textAlign:'center',color:"brown"}}> <b>Daily Demand (kVA)</b></h3>


//   <form onSubmit={handlesingledaySubmit}  style={{border:'1px solid black'}} >
//     {/* <div class='row' style={{display:'flex'}}>
//       <div>  */}
//     <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
// <div className="col">
//   <div className="input-group mb-3" style={{ width: "300px"}}>
//     <div className="input-group-prepend">
//       <label className="input-group-text" htmlFor="inputGroupSelect01">
//       <h6 style={{color:"brown"}}><b>Select Date :</b></h6>    <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
//       </label>
//     </div>
  
//   </div>
// </div>


// </div>
//       {/* <div class="input-group mb-3"  style={{width:"300px",marginTop:"50px"}}>
     
       
//       </div> */}
//       {/* </div>
//     </div> */}
     
//       <button type="submit" class="btn btn-danger btn-lg" style={{height:"40px"}}>View Data</button>

// {/*      
//     <label htmlFor="date">Select a date:</label>
//     <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
//     <button type="submit">Filter Data</button> */}

// {/* <div>
// <h4>  <span>{startDate}</span> to  <span>{endDate}</span></h4>
// </div> */}

// <div id="chart2">


//           {/* {data.length > 0 && (

//           )} */}
//  {
   
//     apexcharts2?<ReactApexChart options={apexcharts2.options} series={apexcharts2.series} type='area' height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

   
//  }

//  </div>
 








 

//   </form>
//   </Grid>
//   </Grid>