import React, { useState, useEffect,useRef  } from 'react';
import axios from 'axios';
import ReactApexChart from 'react-apexcharts';
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';

function BuildindConsumptionPage2() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const [graph,setGraph]=useState([])
    const graphDataUrl="http://localhost:5000/BuildingConsumptionPage2"
    

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





      // const state = {
          
      //   series: [{
      //       name: "GridEnergy(kWh)",
      //       data: Grid.map((data)=>data.cumulative_energy),
      //       yAxis: 0,
      //     },
      //     {
      //       name:"RoofTopenergy(kWh)",
      //       data: currentRooftopData.map((val)=>(val.energy)),
      //       yAxis: 1,
      //       type: "line",
      //     },
      //   //   {
      //   //     name: 'DischargingEnergy',
      //   //     data:  battery.map((val)=>val.dischargingEnergy),
      //   //     type: 'column',
      //   //     yAxis: 0, // Primary y-axis
      //   //     color:"#00008B"
      //   // }, {
      //   //     name: 'Idle',
      //   //     data: battery.map((val)=>val.idleEnergy),
      //   //     type: 'column',
      //   //     yAxis: 0, // Primary y-axis,
      //   //     color:"#FEBE00"
      //   // },
      //   ],
      //   options: {
      //     chart: {
      //       height: 350,
      //       type: 'line',
      //       zoom: {
      //         enabled: false
      //       },
      //     },
      //     dataLabels: {
      //       enabled: false
      //     },
      //     stroke: {
      //       width: [5, 5, 5],
      //       curve: 'straight',
      //       dashArray: [5]
      //     },
      //     title: {
      //       text: 'Page Statistics',
      //       align: 'left'
      //     },
      //     legend: {
      //       tooltipHoverFormatter: function(val, opts) {
      //         return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
      //       }
      //     },
      //     markers: {
      //       size: 0,
      //       hover: {
      //         sizeOffset: 6
      //       }
      //     },
      //     xaxis: {
      //       categories: Grid.map((data)=>data.polledTime)
      //     },
      //     yaxis: [
      //       {
      //         title: {
      //           text: 'Energy (kWh)'
      //         }
      //       },
      //       {
      //         opposite: true,
      //         title: {
      //           text: 'Irradiation (kWh/m2)'
      //         }
      //       }
      //     ],
      //     tooltip: {
      //       y: [
      //         {
      //           title: {
      //             formatter: function (val) {
      //               return val + " (mins)"
      //             }
      //           }
      //         },
      //         {
      //           title: {
      //             formatter: function (val) {
      //               return val + " per session"
      //             }
      //           }
      //         },
      //         {
      //           title: {
      //             formatter: function (val) {
      //               return val;
      //             }
      //           }
      //         }
      //       ]
      //     },
      //     grid: {
      //       borderColor: '#f1f1f1',
      //     }
      //   },
      
      
      // };

      
      
              // Render the Highcharts line graph using the fetched data
  const options = {
    // Highcharts configuration options
    chart: {
      zoomType: 'x'
  },
    series: [
      {
            name:"RoofTopSolar(kWh)",
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
            name: 'dischargingEnergy',
            data: graph.map((val)=>val.BatteryDischarEnergy),
            type: 'column',
            yAxis: 1, // Primary y-axis,
            color:"#528AAE"
        }, 
        // {
        //     name: 'Idle',
        //     data: battery.map((val)=>val.idleEnergy),
        //     type: 'column',
        //     yAxis: 0, // Primary y-axis,
        //     color:"#FEBE00"
        // },
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
            text: "Battery Discharge Energy",
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
  return (
    <div>
      <hr style={{border:"10px solid black"}}/>
     <HighchartsReact highcharts={Highcharts} options={options} />
     {/* <ReactApexChart options={state.options} series={state.series}height="400px" /> */}
    </div>
  )
}

export default BuildindConsumptionPage2
