import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BatteryEnergyPac() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const energy="http://121.242.232.211:5000/analytics/battery"
    const [graphData, setGraphData] = useState([]);
    const [data, setData] = useState([]);
    const [filterDate, setFilterDate] = useState(null);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
        axios.get(energy)
          .then((res) => {
            const dataResponse = res.data;
            setGraphData(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);


      console.log(graphData)


      const handleEndDateChange = (date) => {
        setFilterDate(date);
      };


  
      const fetchData = async () => {
        setLoading(true);
        try {
          const formattedStartDate = filterDate ? new Date(filterDate.getTime() - filterDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      
          const response = await axios.post(`http://121.242.232.211:5000/analytics/fivemingraphs`, {
            date: formattedStartDate,
          });
        
          setData(response.data);
          setLoading(false);
          console.log(formattedStartDate)
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };


      useEffect(() => {
        fetchData();
    }, [filterDate]);

    console.log(data)
// Render the Highcharts line graph using the fetched data
  const options = {
    // Highcharts configuration options
    series: [   {
        name: "Energy(kWh)",
        data: graphData.map((val) => val.batteryEnergy),
        yAxis: 1,
        type: "area",
        color:'#9ACCFB'
      },
      {
        name: "SoC(%)",
        data: graphData.map((val) => val.packsoc),
        yAxis: 0,
        type: "line",
        color: '#FFA500', // Change the color of the "Packsoc" line graph
      },
    
    
    ],
    title: {
        text: null, // Set title text to null
      },
      yAxis: [
        {
          title: {
            text: "SoC (%)",
          },
        },
        {
          title: {
            text: "Energy (kWh)",
          },
          opposite: true, // Display the secondary y-axis on the opposite side of the chart
        },
      ],
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: 'black'
        },
        formatter: function () {
          let tooltipText = '';
    
          if (this.series.index === 0) {
            tooltipText = `${this.y} Energy(kWh)`;
          } else if (this.series.index === 1) {
            tooltipText = `${this.y}% (SoC)`;
          }
    
          const batteryStatus = graphData[this.point.index].batteryStatus;
          const timestamp = graphData[this.point.index].timestamp;
          tooltipText += ` | Battery Status: ${batteryStatus} | Time: ${timestamp}`;
    
          return tooltipText;
        },
      },
    xAxis: {
        type: "category",
        categories: graphData.map((time) => time.timestamp), // Use the pre-formatted timestamp from the API
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



  //---------executing for selected date graph------------//
  const option = {
    // Highcharts configuration options
    series: [   {
        name: "Energy(kWh)",
        data: data.map((val) => val.batteryEnergy),
        yAxis: 1,
        type: "area",
        color:'#9ACCFB'
      },
      {
        name: "SoC(%)",
        data: data.map((val) => val.packsoc),
        yAxis: 0,
        type: "line",
        color: '#FFA500', // Change the color of the "Packsoc" line graph
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
            text: "SoC (%)",
          },
        },
        {
          title: {
            text: "Energy (kWh)",
          },
          opposite: true, // Display the secondary y-axis on the opposite side of the chart
        },
      ],
      tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: 'black'
        },
        formatter: function () {
          let tooltipText = '';
    
          if (this.series.index === 0) {
            tooltipText = `${this.y} Energy(kWh)`;
          } else if (this.series.index === 1) {
            tooltipText = `${this.y}% (SoC)`;
          }
    
          const batteryStatus = data[this.point.index].batteryStatus;
          const timestamp = data[this.point.index].timestamp;
          tooltipText += ` | Battery Status: ${batteryStatus} | Time: ${timestamp}`;
    
          return tooltipText;
        },
      },
    xAxis: {
        type: "category",
        categories: data.map((time) => time.timestamp), // Use the pre-formatted timestamp from the API
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

  
const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [day, month, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
  
const dateValue = filterDate ? new Date(filterDate.getTime() - filterDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;
  return (
    <div>

        <div> 

<div class="row">
  <div class="col-10" > 
  <div className="input-group-prepend" style={{width:"300px",marginLeft:"30px"}}>
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b>Select Date </b></h5>:<DatePicker id="date" selected={filterDate} onChange={handleEndDateChange} placeholderText='select Date' />
        </label>
      </div>
  </div>
  <div class="col-2"><h3>{dateValue}</h3></div>
</div>
<div> 
 <div> <h3 style={{textAlign:"center",margin:"20px",color:"black", fontSize:"30px",fontWeight:"bold",fontFamily:undefined, }}>Daily Energy cycle v/s SoC</h3></div>
 {
    filterDate===null?<HighchartsReact highcharts={Highcharts} options={options} />:<HighchartsReact highcharts={Highcharts} options={option} />
}
</div>

        
        </div>
         
      
    </div>
  )
}

export default BatteryEnergyPac