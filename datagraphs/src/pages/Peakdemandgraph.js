import React, { useState,useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import 'react-datepicker/dist/react-datepicker.css';
import ReactApexChart from 'react-apexcharts';
import BuildindConsumptionPage2 from './BuildindConsumptionPage2';
import Grid from '@mui/material/Grid';
import KvaVsKW from './KvaVsKW';
import {Link} from 'react-router-dom';
import TopTenClients from './TopTenClients'
import BlockWiseData from './BlockWiseData';
import { ipAddress } from '../ipAdress';
 

const iphost='43.205.196.66'
const host = `http://${ipAddress}:5000/peak/hvacSchneider7230Polling`
const pastdata=`http://${ipAddress}:5000/peak/initialgraph`

function Peakdemandgraphs() {
  const scrollToTopTenClients = () => {
    const topTenClientsElement = document.getElementById('topTenClients');
    if (topTenClientsElement) {
      topTenClientsElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [singledayFilter,setSingledayFilter]=useState(null)
  const [singledayFilterData,setSingledayFilterData]=useState([])


  const [initialGraph,setInitialGraph]=useState([])


  const [passevendaystdata,setPastsevendaysdata]=useState([])
 

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
  };

  const handleEndDateChange = (date) => {
  setEndDate(date);
};


const handlesingleDayFilterChange = (date) => {
  setSingledayFilter(date);
};
const handleSubmit = (event) => {
  event.preventDefault();
  fetchData();
};


const CurrentGraph=()=>{
  axios.get(`http://${ipAddress}:5000/peak/hvacSchneider7230Polling`).then((res)=>{
    const dataresponse=res.data
    setInitialGraph(dataresponse)
   
  }).catch((err)=>{
    console.log(err)
  })
}

const pastSevenDaysGraph=()=>{
  axios.get(pastdata).then((res)=>{
    const dataresponse=res.data
    setPastsevendaysdata(dataresponse)
   
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
  //     console.error(error);fetchData
  //   }
  // };

  const fetchData = async () => {
    setLoading(true);
    try {
      const formattedStartDate = startDate ? new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      const formattedEndDate = endDate ? new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
  
      const response = await axios.post(`http://${ipAddress}:5000/filter/hvacSchneider7230Polling`, {
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


  const SingleDayfetchData = async () => {
    setLoading(true);
    try {
      const formattedStartDate = singledayFilter ? new Date(singledayFilter.getTime() - singledayFilter.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
  
      const response = await axios.post(`http://${ipAddress}:5000/singleDayFilter/hvacSchneider7230Polling`, {
        date: formattedStartDate,
      });
    
      setSingledayFilterData(response.data);
      setLoading(false);
      console.log(formattedStartDate)
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

useEffect(() => {
  fetchData();
  }, [startDate, endDate]);

useEffect(() => {
  SingleDayfetchData()
  }, [singledayFilter]);


useEffect(()=>{
  CurrentGraph()
  pastSevenDaysGraph()
},[])

console.log(startDate,endDate)
console.log(initialGraph)
console.log(singledayFilterData)

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
      },
      ],
    
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
      },
     ], 
      
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




 //single days graph
 var apexcharts2 = {
  series: [{
    name:"totalApparentPower2",
    data: initialGraph.map((val)=>(val.peakdemand))
  },
  {
    name:"LmitLine",
    data: initialGraph.map((val)=>(val.limitLine)),
    type:""
  },
 ],
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



//peakDemand initial graph single day//
const currentGraph= {
  // Highcharts configuration options
  chart: {
    zoomType: 'x'
},
  series: [   {
      name: "Apparent Power  (kvA)",
      data:  initialGraph.map((val)=>(val.peakdemand)),
      //yAxis: 1,
      type: "area",
      color:'#6F00FF',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
    {
      name: "LimitLine",
      data:initialGraph.map((val)=>(val.limitLine)),
      //yAxis: 0,
      type: "line",
      color: 'red', // Change the color of the "Packsoc" line graph
      dashStyle: 'dash',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
  
  
  ],
  //   title: {
  //     text: "Daily Energy cycle v/s SoC", // Set the chart title text
  //     align: "center", // Align the title to the center
  //     margin: 10, // Set the margin of the title
  //     style: {
  //       fontSize: "30px", // Set the font size of the title
  //       fontWeight: "bold", // Set the font weight of the title
  //       fontFamily: undefined, // Use the default font family
  //       color: "black", // Set the color of the title
  //     },
  //   },
  title: {
      text: null, // Set title text to null
    },
    yAxis: [
      {
        title: {
          text: "Apparent Power  (kvA)",
          style:{
            fontSize:"15px"
          }
        },
      },
      // {
      //   title: {
      //     text: "Energy (kWh)",
      //   },
      //   opposite: true, // Display the secondary y-axis on the opposite side of the chart
      // },
    ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        background: '#222',
        color: 'black'
      },
    },
  xAxis: {
      type: "category",
      categories: initialGraph.map((time) => time.polledTime), // Use the pre-formatted timestamp from the API
    },
    plotOptions: {
      line: {
        lineWidth: 2, // Increase the line thickness
      },
    },
    exporting: {
      enabled: true, // Enable exporting
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'View Data Table', // Set the text for the custom menu item
              onclick: function () {
                const chart = this;
                const data = chart.getDataRows(); // Get the data rows from the chart
                const table = document.createElement('table'); // Create a table element
                const thead = table.createTHead(); // Create the table header
                const tbody = table.createTBody(); // Create the table body
  
                // Create and append the table header row
                const headerRow = thead.insertRow();
                data[0].forEach((header) => {
                  const th = document.createElement('th');
                  th.textContent = header;
                  headerRow.appendChild(th);
                });
  
                // Create and append the table body rows
                for (let i = 1; i < data.length; i++) {
                  const bodyRow = tbody.insertRow();
                  data[i].forEach((cell) => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    bodyRow.appendChild(td);
                  });
                }
  
                // Open a new window and append the table
                const win = window.open();
                win.document.body.appendChild(table);
              },
            },
            'toggleDataLabels', // Add option for toggling data labels
            'viewFullscreen', // Add option for full-screen mode
            'separator', // Add a separator line
            'downloadPNG', // Enable PNG download option
            'downloadSVG', // Enable SVG download option
            'downloadPDF', // Enable PDF download option
          ],
        },
      },
    },
  
  
   
  // ...
};


//peakDemand filtered graph single day//
const FilteredGraph= {
  // Highcharts configuration options
  chart: {
    zoomType: 'x'
},
  series: [   {
      name: "Apparent Power  (kvA)",
      data:  singledayFilterData.map((val)=>(val.peakdemand)),
      //yAxis: 1,
      type: "area",
      color:'#6F00FF',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
    {
      name: "LimitLine",
      data:singledayFilterData.map((val)=>(val.limitLine)),
      //yAxis: 0,
      type: "line",
      color: 'red', // Change the color of the "Packsoc" line graph
      dashStyle: 'dash',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
  
  
  ],
  //   title: {
  //     text: "Daily Energy cycle v/s SoC", // Set the chart title text
  //     align: "center", // Align the title to the center
  //     margin: 10, // Set the margin of the title
  //     style: {
  //       fontSize: "30px", // Set the font size of the title
  //       fontWeight: "bold", // Set the font weight of the title
  //       fontFamily: undefined, // Use the default font family
  //       color: "black", // Set the color of the title
  //     },
  //   },
  title: {
      text: null, // Set title text to null
    },
    yAxis: [
      {
        title: {
          text: "Apparent Power  (kvA)",
          style:{
            fontSize:"15px"
          }
        },
      },
      // {
      //   title: {
      //     text: "Energy (kWh)",
      //   },
      //   opposite: true, // Display the secondary y-axis on the opposite side of the chart
      // },
    ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        background: '#222',
        color: 'black'
      },
    },
  xAxis: {
      type: "category",
      categories: singledayFilterData.map((time) => time.polledTime), // Use the pre-formatted timestamp from the API
    },
    plotOptions: {
      line: {
        lineWidth: 2, // Increase the line thickness
      },
    },
    exporting: {
      enabled: true, // Enable exporting
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'View Data Table', // Set the text for the custom menu item
              onclick: function () {
                const chart = this;
                const data = chart.getDataRows(); // Get the data rows from the chart
                const table = document.createElement('table'); // Create a table element
                const thead = table.createTHead(); // Create the table header
                const tbody = table.createTBody(); // Create the table body
  
                // Create and append the table header row
                const headerRow = thead.insertRow();
                data[0].forEach((header) => {
                  const th = document.createElement('th');
                  th.textContent = header;
                  headerRow.appendChild(th);
                });
  
                // Create and append the table body rows
                for (let i = 1; i < data.length; i++) {
                  const bodyRow = tbody.insertRow();
                  data[i].forEach((cell) => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    bodyRow.appendChild(td);
                  });
                }
  
                // Open a new window and append the table
                const win = window.open();
                win.document.body.appendChild(table);
              },
            },
            'toggleDataLabels', // Add option for toggling data labels
            'viewFullscreen', // Add option for full-screen mode
            'separator', // Add a separator line
            'downloadPNG', // Enable PNG download option
            'downloadSVG', // Enable SVG download option
            'downloadPDF', // Enable PDF download option
          ],
        },
      },
    },
  
  
   
  // ...
};



//daily peakDemand initial graph//

const PeakValueGraph= {
  // Highcharts configuration options
  chart: {
    zoomType: 'x'
},
  series: [   {
      name: "Apparent Power  (kvA)",
      data:  passevendaystdata.map((val)=>(val.peakdemand)),
      //yAxis: 1,
      type: "column",
      color:'#00308F',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
  
  
  ],
  //   title: {
  //     text: "Daily Energy cycle v/s SoC", // Set the chart title text
  //     align: "center", // Align the title to the center
  //     margin: 10, // Set the margin of the title
  //     style: {
  //       fontSize: "30px", // Set the font size of the title
  //       fontWeight: "bold", // Set the font weight of the title
  //       fontFamily: undefined, // Use the default font family
  //       color: "black", // Set the color of the title
  //     },
  //   },
  title: {
      text: null, // Set title text to null
    },
    yAxis: [
      {
        title: {
          text: "Apparent Power  (kvA)",
          style:{
            fontSize:"15px"
          }
        },
      },
      // {
      //   title: {
      //     text: "Energy (kWh)",
      //   },
      //   opposite: true, // Display the secondary y-axis on the opposite side of the chart
      // },
    ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        background: '#222',
        color: 'black'
      },
    },
  xAxis: {
      type: "category",
      categories: passevendaystdata.map((val)=>(val.polledTime)), // Use the pre-formatted timestamp from the API
    },
    plotOptions: {
      line: {
        lineWidth: 2, // Increase the line thickness
      },
    },
    exporting: {
      enabled: true, // Enable exporting
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'View Data Table', // Set the text for the custom menu item
              onclick: function () {
                const chart = this;
                const data = chart.getDataRows(); // Get the data rows from the chart
                const table = document.createElement('table'); // Create a table element
                const thead = table.createTHead(); // Create the table header
                const tbody = table.createTBody(); // Create the table body
  
                // Create and append the table header row
                const headerRow = thead.insertRow();
                data[0].forEach((header) => {
                  const th = document.createElement('th');
                  th.textContent = header;
                  headerRow.appendChild(th);
                });
  
                // Create and append the table body rows
                for (let i = 1; i < data.length; i++) {
                  const bodyRow = tbody.insertRow();
                  data[i].forEach((cell) => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    bodyRow.appendChild(td);
                  });
                }
  
                // Open a new window and append the table
                const win = window.open();
                win.document.body.appendChild(table);
              },
            },
            'toggleDataLabels', // Add option for toggling data labels
            'viewFullscreen', // Add option for full-screen mode
            'separator', // Add a separator line
            'downloadPNG', // Enable PNG download option
            'downloadSVG', // Enable SVG download option
            'downloadPDF', // Enable PDF download option
          ],
        },
      },
    },
  
  
   
  // ...
};



//daily peakDemand filtered graph//

const PeakValueFilteredGraph= {
  // Highcharts configuration options
  chart: {
    zoomType: 'x'
},
  series: [   {
      name: "Apparent Power  (kvA)",
      data:  data.map((val)=>(val.peakdemand)),
      //yAxis: 1,
      type: "column",
      color:'#00308F',
      marker: {
        enabled: false, // Disable markers for the series
      },
    },
  
  
  ],
  //   title: {
  //     text: "Daily Energy cycle v/s SoC", // Set the chart title text
  //     align: "center", // Align the title to the center
  //     margin: 10, // Set the margin of the title
  //     style: {
  //       fontSize: "30px", // Set the font size of the title
  //       fontWeight: "bold", // Set the font weight of the title
  //       fontFamily: undefined, // Use the default font family
  //       color: "black", // Set the color of the title
  //     },
  //   },
  title: {
      text: null, // Set title text to null
    },
    yAxis: [
      {
        title: {
          text: "Apparent Power  (kvA)",
          style:{
            fontSize:"15px"
          }
        },
      },
      // {
      //   title: {
      //     text: "Energy (kWh)",
      //   },
      //   opposite: true, // Display the secondary y-axis on the opposite side of the chart
      // },
    ],
    tooltip: {
      enabled: true,
      theme: 'dark',
      style: {
        background: '#222',
        color: 'black'
      },
    },
  xAxis: {
      type: "category",
      categories: data.map((val)=>(val.timestamp)), // Use the pre-formatted timestamp from the API
    },
    plotOptions: {
      line: {
        lineWidth: 2, // Increase the line thickness
      },
    },
    exporting: {
      enabled: true, // Enable exporting
      buttons: {
        contextButton: {
          menuItems: [
            {
              text: 'View Data Table', // Set the text for the custom menu item
              onclick: function () {
                const chart = this;
                const data = chart.getDataRows(); // Get the data rows from the chart
                const table = document.createElement('table'); // Create a table element
                const thead = table.createTHead(); // Create the table header
                const tbody = table.createTBody(); // Create the table body
  
                // Create and append the table header row
                const headerRow = thead.insertRow();
                data[0].forEach((header) => {
                  const th = document.createElement('th');
                  th.textContent = header;
                  headerRow.appendChild(th);
                });
  
                // Create and append the table body rows
                for (let i = 1; i < data.length; i++) {
                  const bodyRow = tbody.insertRow();
                  data[i].forEach((cell) => {
                    const td = document.createElement('td');
                    td.textContent = cell;
                    bodyRow.appendChild(td);
                  });
                }
  
                // Open a new window and append the table
                const win = window.open();
                win.document.body.appendChild(table);
              },
            },
            'toggleDataLabels', // Add option for toggling data labels
            'viewFullscreen', // Add option for full-screen mode
            'separator', // Add a separator line
            'downloadPNG', // Enable PNG download option
            'downloadSVG', // Enable SVG download option
            'downloadPDF', // Enable PDF download option
          ],
        },
      },
    },
  
  
   
  // ...
};
// const curdGraph= startDate || endDate ?  apexcharts: apexcharts2;
// const testing = startDate || endDate ?  "selected graph executed": "current date graph executed";
// console.log(testing)



const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [month, day, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
//const dateValue = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;



 
  

  return (
    <div >
{/* style={{background:"#252440"}} */}

      <div> 
        <h3 style={{textAlign:"center"}}><b>Building Consumption</b></h3>
      </div>
      <br/>
      <br/>
       <div> 
    <BuildindConsumptionPage2/>
  </div>
  <br/>
  <br/>
      <div>
      <h4 style={{textAlign:"center",color:"brown"}}><b>Peak Demand (kVA)</b></h4>

      <Grid sx={{ flexGrow: 1 }} container spacing={2} >
      
<Grid item xs={12} sm={6} >
<h5 style={{textAlign:"center"}}><b>Daily Demand(kVA)</b></h5>
    <form onSubmit={handleSubmit}>
      {/* <br/>
      
      <br/>
      <br/> */}

      <div className="row" style={{marginTop:'20px',marginLeft:"20px"}}>
  <div className="col-3">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown"}}><b>Date :</b></h6> <DatePicker id="date" selected={singledayFilter} onChange={handlesingleDayFilterChange} placeholderText={currentdate} />  
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
        {/* <ReactApexChart options={curdGraph.options} series={curdGraph.series} type={graphChange} height="400px" /> */}
        {
          singledayFilter===null? <HighchartsReact highcharts={Highcharts} options={currentGraph} />: <HighchartsReact highcharts={Highcharts} options={FilteredGraph} />
        }
       
      </div>
    )}
    </Grid>
    {/* <hr style={{border:"4px solid black"}}/> */}
    <Grid item xs={12} sm={6} >
      <h5 style={{textAlign:"center"}}><b>Maximum Demand(kVA)</b></h5>
    <form onSubmit={handleSubmit}>

      <div className="row" style={{marginTop:'20px',marginLeft:"20px"}}>
  <div className="col-6">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown"}}><b> Start Date :</b></h6> <DatePicker id="date" selected={startDate} onChange={handleStartDateChange} placeholderText={currentdate} />
        </label>
      </div>
     
    </div>
  </div>

  <div className="col-6">
    <div className="input-group mb-3" style={{ width: "300px" }}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h6 style={{color:"brown"}}><b>End Date :</b></h6> <DatePicker selected={endDate} onChange={handleEndDateChange} placeholderText={currentdate}/>
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
        {/* <ReactApexChart options={curdGraph.options} series={curdGraph.series} type={graphChange} height="400px" /> */}
        {/* {
          startDate===null? <HighchartsReact highcharts={Highcharts} options={PeakValueGraph} />: <HighchartsReact highcharts={Highcharts} options={FilteredGraph} />
        } */}
        {
          startDate ===null &&endDate===null? <HighchartsReact highcharts={Highcharts} options={PeakValueGraph} />: <HighchartsReact highcharts={Highcharts} options={PeakValueFilteredGraph} />

        }
       
        {/* PeakValueFilteredGraph */}
       
      </div>
    )}
    </Grid>
    </Grid>

    <div> 

    </div>
  </div>
  <br/>
  <br/>
  {/* <KvaVsKW/> */}

  {/* <TopTenClients/> */}
  {/* <div> 
  <KvaVsKW/>
  </div> */}

  {/* <Grid sx={{ flexGrow: 1 }} container spacing={2} >
  
  <Grid item xs={12} sm={6} >
      <div id="topTenClients"> 
    <TopTenClients/>
  </div>

  

      </Grid>

      
 
      <Grid item xs={12} sm={6} >
      <div id="topTenClients"> 
    <BlockWiseData/>
  </div>
  

      </Grid>
      </Grid> */}


  
 

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