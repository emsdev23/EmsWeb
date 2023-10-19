import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BuildindConsumptionPage2() {
  const host='43.205.196.66'
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const [graph,setGraph]=useState([])
    const graphDataUrl=`http://${host}:5000/BuildingConsumptionPage2`


    const [data, setData] = useState([]);
    const [systemOverviewfilterDate, setSystemOverviewfilterDate] = useState(null);
    

    useEffect(() => {
        axios.get(graphDataUrl)
          .then((res) => {
            const dataResponse = res.data;
            setGraph(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);


      const handleDateChange = (date) => {
        setSystemOverviewfilterDate(date);
      };


      const fetchSystemOverViewData = async () => {
        //setLoading(true);
        try {
          const formattedDate = systemOverviewfilterDate ? new Date(systemOverviewfilterDate.getTime() - systemOverviewfilterDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      
          const response = await axios.post(`http://${host}:5000/filteredGraph/BuildingConsumptionPage2`, {
            date: formattedDate,
          });
        
          setData(response.data);
          // setLoading(false);
          console.log(formattedDate)
        } catch (error) {
          console.error(error);
          //setLoading(false);
        }
      };


      useEffect(() => {
        fetchSystemOverViewData();
    }, [systemOverviewfilterDate]);


      
      
              // Render the Highcharts line graph using the fetched data
  const options = {
    // Highcharts configuration options
    chart: {
      zoomType: 'x'
  },
    series: [
      {
            name:"Roof Top Solar(kWh)",
            data: graph.map((val)=>(val.RooftopEnergy)),
            yAxis: 0,
            type: "line",
            color:"#00008B"
          },
          {
            name: "Grid(kWh)",
    data: graph.map((data)=>data.GridEnergy), 
    yAxis: 0, // Primary y-axis
    type: "line",
    color: "#FF0000",
    dashStyle: "dash",
          // ...
        },
        {
          name:"Wheeled In Solar(kWh)",
          data: graph.map((val)=>(val.WheeledInSolar)),
          yAxis: 0,
          type: "line",
          color:"#fcba03"
        },
        {
            name: 'Thermal Discharging Energy',
            data: graph.map((val)=>val.thermalDischarge),
            type: 'column',
            yAxis: 0, // Primary y-axis,
            color:"#528AAE"
        }, 
      ],
      title: {
        text: null, // Set title text to null
      },
      yAxis: [
        {
          title: {
            text: "Energy(kWh)",
          },
        },
        {
          title: {
            text: "TS Discharge Energy",
          },
          opposite: true, // Display the secondary y-axis on the opposite side of the chart
        },
      ],
    //   xAxis: {
    //     type: 'category', // Specify the x-axis as a category axis
    //     categories: voltcurrent.map((val) => val.timestamp),
    //     labels: {
    //       formatter: function () {
    //         return Highcharts.dateFormat('%H:%M', new Date(this.value)); // Format the x-axis labels as desired
    //       }
    //     },
    //   },
    // xAxis: {
    //     type: "category", // Specify the x-axis as a category axis
    //     categories: voltcurrent.map((val) => val.timestamp),
    //     labels: {
    //       formatter: function () {
    //         const timestamp = this.value;
    //         return timestamp; // Display the timestamp as the x-axis label
    //       },
    //     },
    //   },
    xAxis: {
        type: "category",
        categories:  graph.map((data)=>data.Timestamp), // Use the pre-formatted timestamp from the API
      },
      plotOptions: {
        line: {
            lineWidth: 3, // Increase the line thickness
            // Set the line to dashed
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


  const systemoverviewfilteredgraph = {
    // Highcharts configuration options
    chart: {
      zoomType: 'x'
  },
    series: [
      {
            name:"Roof Top Solar(kWh)",
            data: data.map((val)=>(val.RooftopEnergy)),
            yAxis: 0,
            type: "line",
            color:"#00008B"
          },
          {
            name: "Grid(kWh)",
    data: data.map((data)=>data.GridEnergy), 
    yAxis: 0, // Primary y-axis
    type: "line",
    color: "#FF0000",
    dashStyle: "dash",
          // ...
        },
        {
          name:"Wheeled In Solar(kWh)",
          data: data.map((val)=>(val.WheeledInSolar)),
          yAxis: 0,
          type: "line",
          color:"#fcba03"
        },
        {
            name: 'Thermal Discharging Energy',
            data: data.map((val)=>val.thermalDischarge),
            type: 'column',
            yAxis: 0, // Primary y-axis,
            color:"#528AAE"
        }, 
      ],
      title: {
        text: null, // Set title text to null
      },
      yAxis: [
        {
          title: {
            text: "Energy(kWh)",
          },
        },
        {
          title: {
            text: "TS Discharge Energy",
          },
          opposite: true, // Display the secondary y-axis on the opposite side of the chart
        },
      ],
    //   xAxis: {
    //     type: 'category', // Specify the x-axis as a category axis
    //     categories: voltcurrent.map((val) => val.timestamp),
    //     labels: {
    //       formatter: function () {
    //         return Highcharts.dateFormat('%H:%M', new Date(this.value)); // Format the x-axis labels as desired
    //       }
    //     },
    //   },
    // xAxis: {
    //     type: "category", // Specify the x-axis as a category axis
    //     categories: voltcurrent.map((val) => val.timestamp),
    //     labels: {
    //       formatter: function () {
    //         const timestamp = this.value;
    //         return timestamp; // Display the timestamp as the x-axis label
    //       },
    //     },
    //   },
    xAxis: {
        type: "category",
        categories:  data.map((data)=>data.Timestamp), // Use the pre-formatted timestamp from the API
      },
      plotOptions: {
        line: {
            lineWidth: 3, // Increase the line thickness
            // Set the line to dashed
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


  const now = new Date();
  const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
  const [month, day, year] = local.split("/"); // Split the date by "/"
  const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
  const dateValue = systemOverviewfilterDate ? new Date(systemOverviewfilterDate.getTime() - systemOverviewfilterDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;
  return (
    <div>
 <div> 
      <h4 style={{textAlign:'center',marginTop:"15px",color:"brown"}}><b style={{fontSize:"30px"}}>System Overview</b></h4>
      </div>
<div class="row">
  <div class="col-10" > 
  <div className="input-group-prepend" style={{width:"270px",marginLeft:"30px"}}>
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h5 style={{color:"brown"}}><b>Date :-</b></h5> <DatePicker id="date" className="form-control" selected={systemOverviewfilterDate} onChange={handleDateChange} style={{ width: "200px" }}  placeholderText={dateValue}  />
        </label>
        
      </div>
  </div>
  {/* <div class="col-2"><h3>{dateValue}</h3></div> */}
</div>
      {/* <hr style={{border:"10px solid black"}}/> */}
     
      {/* <h4 style={{color:"brown",textAlign:"center"}}><b>System Overview</b></h4> */}
      {
        systemOverviewfilterDate==null?<HighchartsReact highcharts={Highcharts} options={options} />: <HighchartsReact highcharts={Highcharts} options={systemoverviewfilteredgraph} />
      }
    
     {/* <ReactApexChart options={state.options} series={state.series}height="400px" /> */}
    </div>
  )
}

export default BuildindConsumptionPage2
