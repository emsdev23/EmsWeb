import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Table from 'react-bootstrap/Table';
import ReactApexChart from 'react-apexcharts';
import CircularProgress from '@mui/material/CircularProgress';

const host = "localhost"

function Peakdemandgraphs() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (event) => { 
    event.preventDefault();
    try {
      const formattedDate = selectedDate.toISOString().substring(0, 10);
      const response = await axios.post('http://localhost:5000/past/hvacSchneider7230Polling', { date: formattedDate });
      setData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  console.log(data)
  console.log(selectedDate)
  const graphdata=[]

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
console.log(graphdata)



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
          type: 'area',
          height: 350
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: "peak demand",
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
          categories: graphdata.map((time) => time.timeStamp[1]),
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
        // fill:{
        //   target:"origin",
        //   below:'#00FF7F',
        //   above:'#20B2AA'
        // },
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
           
    <form onSubmit={handleSubmit} >
        <div class="input-group mb-3"  style={{width:"300px",marginTop:"50px"}}>
        <label class="input-group-text" for="inputGroupSelect01">Select Date:</label> 
        <br/>
        <button type="submit" class="btn btn-danger btn-lg" style={{height:"40px"}}>View Data</button>
        
        <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
        {/* <button type="submit">Filter Data</button> */}
        <br/>
        <br/>
        

        </div>
{/*       
      <label htmlFor="date">Select a date:</label>
      <DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
      <button type="submit">Filter Data</button> */}


<div id="chart2"> 
            {/* {data.length > 0 && (

            )} */}
   {
      graphdata?<ReactApexChart options={apexcharts.options} series={apexcharts.series} type="area" height='400px'  />:<div ><CircularProgress style={{color: "black"}} ></CircularProgress><h3>Graph Loading.... </h3></div>

     
   }
  
   </div>

    </form>
   {graphdata.length > 0 && (
      // <ul>
      //   {data.map((item) => (
      //     <li key={item.recordId}>{item.totalApparentPower1}</li>
          
      //   ))}
      // </ul>
      <Table striped bordered hover variant="dark"  style={{marginTop:"50px"}}>
      <thead>
        <tr>
          <th>totalApparentPower2</th>
          <th>polledTime</th>
        
        </tr>
      </thead>
      <tbody>
        
        {graphdata.map((item) => (
          <tr key={item.recordId}>
           {/* <li key={item.recordId}>{item.totalApparentPower1}</li> */}
          <td >{item.totalApparentPower2}</td>
          {/* <td >{item.totalApparentPower2}</td> */}
          <td >{item.timeStamp}</td>
          </tr>
          
        ))}
          
          {/* <td>Common header outlet temperature </td>
          <td>Common header outlet temperature limit has crossed 10 deg-C</td>
          <td>Alert Email</td>
          <td>High</td> */}
          
        
        
      </tbody>
    </Table>
      
    )} 
  </div>
   
  )
}

export default Peakdemandgraphs

//backend
// app.post("/past/hvacSchneider7230Polling", (req, res) => {
//   const { date } = req.body;
//   const query = `SELECT * FROM hvacSchneider7230Polling WHERE DATE(polledTime) = '${date}'`;
//   chakradb.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       return res.status(500).json({ message: 'An error occurred' });
//     }
//     return res.json(results);
//   });
// });


 // <div>
      {/* <h1>graphs</h1>
      <select className="form-select" onChange={handleSelect}>
        <option value="">Options</option>
        <option value="0">Yesterday</option>
        <option value="1">Week</option>
        <option value="2">Month</option>
      </select>
      <div>
        {data.map(item => (
          <div key={item}>
            <h2>{item.batteryStatus}</h2>
            <p>{item.dischargingAVG}</p>
          </div>
        ))}
      </div> */}
      

    
    {/* </div> */}