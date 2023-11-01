import {useEffect, useState} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import Card from 'react-bootstrap/Card';
import { colors } from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const Thermal = () => {
    const [result, setResult] = useState([])
    const host="43.205.196.66"

    const [selectedDate, setSelectedDate] = useState(null);
    const [singledaydata,setSingledaydata]=useState([])


    //---------function to handle change in inputTag----------------//
    const handleDateChange = (selectedDate) => {
      setSelectedDate(selectedDate);
    };


      //------------function to post request according selected date------------------//
      const handlesingledayFilter = async () => {
       
        try {
          const formattedDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : ''
          const response = await axios.post(`http://${host}:5000/thermal/datefilter`, { date: formattedDate });
          setSingledaydata(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      //--------------------------end of function------------//

       //-------calling the post request function inside the useEffect----------//
       useEffect(()=>{
        handlesingledayFilter()

      },[selectedDate])

      console.log(singledaydata)

  
    const namelist = () =>{
     axios.get(`http://${host}:5000/thermal`).then((res)=>setResult(res.data))
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


    //filter date calculation
    let filteredresultkeys = []
    let filteredaverageenergy = []
    for (const re in singledaydata){
      if (filteredresultkeys.includes(re) !== true){
        filteredresultkeys.push(re)
        filteredaverageenergy.push(singledaydata[re]["chillerEnergy"])
      }
  }

    console.log(resultkeys)
    console.log(averageenergy)

    console.log(filteredresultkeys)
    console.log(filteredaverageenergy)

    const graph={
      series :
          [{
              name : "Cooling Energy",
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



          const Filteredgraph={
            series :
                [{
                    name : "Cooling Energy",
                    data : filteredaverageenergy.map((val)=>val.toFixed(2))  
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
                    categories :filteredresultkeys.map((val)=>val),
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

                const now = new Date();
                const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
                const [month, day, year] = local.split("/"); // Split the date by "/"
                const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
  
      return(
        <div>
          <div> 
          <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col-10">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b> Date :- </b></h5><DatePicker id="date" selected={selectedDate} onChange={handleDateChange} placeholderText={currentdate} />
        </label>
      </div>
     
    </div>
  </div>
  </div>
            </div> 
            <div>

              {
                selectedDate==null? <Chart type='area'
                height = {'170%'}
                width={'100%'}
                series = {graph.series}
                options = {graph.options}
                />: <Chart type='area'
                height = {'170%'}
                width={'100%'}
                series = {Filteredgraph.series}
                options = {Filteredgraph.options}
                />
              }
            

            </div>
      
        </div>
    )
  
  }
  
  export default Thermal;
