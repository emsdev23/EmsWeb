//import React from 'react'
import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function BatteryCurrentvolt() {

  const [data, setData] = useState([]);
  const [voltcurrentfilterDate, setVoltcurrentfilterDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const voltage="http://121.242.232.211:5000/analytics/battery/voltage&current"
  const [voltcurrent,setVoltcurrent]=useState([])

    exportingInit(Highcharts);
exportDataInit(Highcharts);

    
    useEffect(() => {
        axios.get(voltage)
          .then((res) => {
            const dataResponse = res.data;
            setVoltcurrent(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);


      const handleEndDateChange = (date) => {
        setVoltcurrentfilterDate(date);
      };


      const fetchData = async () => {
        setLoading(true);
        try {
          const formattedStartDate = voltcurrentfilterDate ? new Date(voltcurrentfilterDate.getTime() - voltcurrentfilterDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      
          const response = await axios.post(`http://121.242.232.211:5000/analytics/onemingraph`, {
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
    }, [voltcurrentfilterDate]);

    console.log(data)

        // Render the Highcharts line graph using the fetched data
  const options = {
    // Highcharts configuration options
    series: [
        {
          name: "Voltage(V)",
          data: voltcurrent.map((val) => val.batteryVoltage),
          yAxis: 0, // Primary y-axis
          type: "line",
          color:"#FF0000"
          // ...
        },
        {
          name: "Current(A)",
          data: voltcurrent.map((val) => val.batteryCurrent),
          yAxis: 1, // Secondary y-axis
          type: "area",
          // ...
        },
      ],
      title: {
        text: null, // Set title text to null
      },
      yAxis: [
        {
          title: {
            text: "Voltage(V)",
          },
        },
        {
          title: {
            text: "Current(A)",
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
        categories: voltcurrent.map((val) => val.timestamp), // Use the pre-formatted timestamp from the API
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

//------------------graph for filtered date----------------//
const option = {
  // Highcharts configuration options
  series: [
      {
        name: "Voltage(V)",
        data: data.map((val) => val.batteryVoltage),
        yAxis: 0, // Primary y-axis
        type: "line",
        color:"#FF0000"
        // ...
      },
      {
        name: "Current(A)",
        data: data.map((val) => val.batteryCurrent),
        yAxis: 1, // Secondary y-axis
        type: "area",
        // ...
      },
    ],
    title: {
      text: null, // Set title text to null
    },
    yAxis: [
      {
        title: {
          text: "Voltage(V)",
        },
      },
      {
        title: {
          text: "Current(A)",
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
      categories: data.map((val) => val.timestamp), // Use the pre-formatted timestamp from the API
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

    
  return (
    <div>
              <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b>Select Date </b></h5>:<DatePicker id="date" selected={voltcurrentfilterDate} onChange={handleEndDateChange} placeholderText='select Date' />
        </label>
      </div>
     
    </div>
  </div>

 
</div>
<div> 
<div > <h3 style={{textAlign:"center",margin:"20px",color:"black", fontSize:"30px",fontWeight:"bold",fontFamily:undefined, }}>Votage v/s Current</h3></div>
{
    voltcurrentfilterDate===null? <HighchartsReact highcharts={Highcharts} options={options} />: <HighchartsReact highcharts={Highcharts} options={option} />
}
</div>

     
    </div>
  )
}
//voltcurrentfilterDate

export default BatteryCurrentvolt