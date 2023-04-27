import {useEffect, useState} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Card from 'react-bootstrap/Card';
import { colors } from '@mui/material';


const Thermal = () => {
    const [result, setResult] = useState([])
  
    const namelist = () =>{
     axios.get("http://121.242.232.211:5000/thermal").then((res)=>setResult(res.data))
    }

   

    useEffect(()=>{ 
      namelist()
    },[])

    // console.log(result)

    let resultkeys = []
    let averageenergy = []

    for (const re in result){
        if (resultkeys.includes(re) !== true){
            resultkeys.push(re)
            averageenergy.push(result[re]["chillerEnergy"])
        }
    }

    console.log(resultkeys)
    console.log(averageenergy)

    const graph={
      series :
          [{
              name : "power",
              data : averageenergy.map((val)=>val.toFixed(2))  
          }],
  
          options: {
            chart: {
              type: 'bar',
              height: 350
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
            dataLabels: {
              enabled: false,
            },
            colors:["#384147"],
            yaxis: {
              title: {
                text: 'ckWh',
              }
            },
            xaxis : {
              title : {text:"Time in Hour"},
              categories :resultkeys.map((val)=>val),
              colors:"white"
            },
              labels: {
                rotate: 0
              },
                   tooltip: {
        enabled: true,
        theme: 'dark',
        style: {
          background: '#222',
          color: '#031157'
        }
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
            
              colors: ['#7aadeb']
            },
            }
          }
  
      return(
        // <Card style={{ width: '18rem' }}>
        //     <Card.Body>
        //         <div  className="title">
        //         <Card.Title><b>Thermal Storage</b></Card.Title>
        //         </div>
        //     <div >
        //     <Chart type='area'
        //     height = {350}
        //     width={500}
        //     series = {graph.series}
        //     options = {graph.options}
        //     />
        // </div>
        //     </Card.Body>
        // </Card>
        <div> 
        <Chart type='area'
            height = {'170%'}
            width={'100%'}
            series = {graph.series}
            options = {graph.options}
            />
        </div>
    )
  
  }
  
  export default Thermal;
