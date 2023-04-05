import {useEffect, useState} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Card from 'react-bootstrap/Card';


const Thermal = () => {
    const [result, setResult] = useState([])
  
    const namelist = () =>{
     axios.get("http://localhost:5000/thermal").then((res)=>setResult(res.data))
    }

   

    useEffect(()=>{ 
      namelist()
    })

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
              data : averageenergy.map((val)=>val)  
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
            yaxis: {
              title: {
                text: 'kW',
              }
            },
            xaxis : {
              title : {text:"Time in Hour"},
              categories :resultkeys.map((val)=>val)  
            },
              labels: {
                rotate: 0
              }
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
            height = {270}
            width={400}
            series = {graph.series}
            options = {graph.options}
            />
        </div>
    )
  
  }
  
  export default Thermal;