import React, { useState } from "react";
import Papa from "papaparse";
// import { Line} from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// import {
//     Chart as ChartJS,
//     CategoryScale,
//     LinearScale,
//     PointElement,
//     LineElement,
//     Title,
//     Tooltip,
//     Legend,
//     Filler 
//   } from 'chart.js';

  // ChartJS.register(
  //   CategoryScale,
  //   LinearScale,
  //   PointElement,
  //   LineElement,
  //   Title,
  //   Tooltip,
  //   Legend,
  //   Filler 
  // );

function Documentation() {
  // const rechartdata = [
  //   {
  //     name: 'Page A',
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     name: 'Page B',
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     name: 'Page C',
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     name: 'Page D',
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     name: 'Page E',
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     name: 'Page F',
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     name: 'Page G',
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  // ];
    const [data,setData]=useState([])
    const [columnArray,setColumnArray]=useState([])
    const [value,setValue]=useState([])
    const [datagrap,setDatagrap]=useState(null)
    var Energy=[]
    var Diesel=[]
    var Grid=[]
    var Solar=[]

    var newEnergy=[]
    var Dieselval=[]
    var gridval=[]
    var solarval=[]

   
    var en=[]
   var Dv=[]
   var Gv=[]
   var Sv=[]

   var object=[]

    var outputArray=[]
    var count=0
    // const optionsdata={
    //     type:'scatter',
    
    //     plugins:{
    //       legend:true,
    //       position: 'left',
    //     },
    
    //   }

       const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'bar chart',
      },
    },
  }

    const handlefile=(event)=>{
        Papa.parse(event.target.files[0],{
            header:true,
            skipEmptyLines:true,
            complete:function(result){
                const columnArray=[]
                const valuesArray=[]
                result.data.map((d)=>{
                    columnArray.push(Object.keys(d))
                    valuesArray.push(Object.values(d))
                });
                setData(result.data)
                setColumnArray(columnArray)
                setValue(valuesArray)
            }
        })
        
    }
    // for(let i=0;i<data.length;i++){
    //   var newdata=data[0].Energy.split(' ')
    // }
    // console.log(newdata)
        // console.log(columnArray)
        // console.log(value)

              var start = false;
     
         for (let j = 0; j < columnArray.length; j++) {
             for (let k = 0; k < outputArray.length; k++) {
                 if ( columnArray[j] == outputArray[k] ) {
                     start = true;
                 }
             }
             count++;
             if (count == 1 && start == false) {
                 outputArray.push(columnArray[j]);
             }
             start = false;
             count = 0;
         }

         for(let i=0; i<data.length;i++){
            var response=data[i]
            Energy.push(response.Energy)
            Diesel.push(response.Diesel)
            Grid.push(response.Grid)
            Solar.push(response.Solar)
        }
        
        for(let i=0;i<Energy.length;i++){
          var newvalue=Energy[i].split(" ")
          newEnergy.push(newvalue)
        }
        for(let i=0;i<Diesel.length;i++){
          var Dieselvalue=Diesel[i].split(" ")
          Dieselval.push(Dieselvalue)
        }

        for(let i=0;i<Grid.length;i++){
          var Gridvalue=Diesel[i].split(" ")
          gridval.push(Gridvalue)
        }

        for(let i=0;i<Solar.length;i++){
          var solarvalue=Diesel[i].split(" ")
          solarval.push(solarvalue)
        }

        // console.log(Energy)

        //  console.log(outputArray)


      for(let j=0; j<newEnergy.length;j++){
        var actual=newEnergy[j][0]
        en.push(actual)
      }

      for(let k=0;k<Dieselval.length;k++){
        var actualdv=Dieselval[k][0]
        Dv.push(actualdv)
      }
      for(let k=0;k<gridval.length;k++){
        var actualgv=gridval[k][0]
        Gv.push(actualgv)
      }
      for(let k=0;k<solarval.length;k++){
        var actualsv=solarval[k][0]
        Sv.push(actualsv)
      }

      var labels =en.map((data)=>data);
         const graphdata2 = {
            labels,
            type:"line",
            datasets: [
              {
                label:"energy",
                data: en.map((data)=>data),
                fill:true,
                backgroundColor: "rgba(75,192,192,0.2)",
                borderColor: "rgba(75,192,192,1)",
                // lineTension: 0.8,
                // pointRadius: 2,
              },
              {
                label:'Diesel',
                data: Dv.map((res)=>res),
                fill:true,
                borderColor:"#FA240A",
                backgroundColor:"#FFCCCB",
                // lineTension: 0.8,
                // pointRadius: 2,
              },
              {
                label:'Grid',
                data: Gv.map((res)=>res),
                fill:true,
                borderColor:"brown",
                backgroundColor:"#C4A484",
                // lineTension: 0.8,
                // pointRadius: 2,
              },
              {
                label:'Solar',
                data: Sv.map((res)=>res),
                fill:true,
                borderColor:"green",
                backgroundColor:"#90EE90",
                // lineTension: 0.8,
                // pointRadius: 2,
              },
            ]
          };

          
        

          // const Data={
          //   type: "bar",
          //   labels,
              
          //     datasets: [{ 
          //       label:"Energy",
          //       data:en.map((data)=>data),
          //       backgroundColor: "red",
              
          //     }, { 
          //       label:'Diesel',
          //       data: Dv.map((res)=>res) ,
          //       backgroundColor:"green",
          //     }, { 
          //       data: Gv.map((data)=>data),
                
          //       backgroundColor:"blue",
          //       label:'Grid',
                
          //     },
          //     { 
          //       data: Sv.map((val)=>val),
          //       backgroundColor:"brown",
          //       label:'Solar',
          //     }]
          // };

        
    // setDatagrap('ganesh')
    // for(let j=0; j<newEnergy.length; j++){
    //   var actualvalue=newEnergy[j].split(",")
    //   en.push(actualvalue)
    // }
    for(let j=0; j<data.length;j++){
     var valuedata=data[j]
     var gridvalue=data[j].Grid.split(" ")[0]
     var solarvalue=data[j].Solar.split(" ")[0]
     var Diesel=data[j].Diesel.split(" ")[0]
     var Energy=data[j].Energy.split(" ")[0]
     object.push({Solar:solarvalue,Grid:gridvalue,Diesel:Diesel,Energy:Energy})
    //  object['Grid']=valuedata.Grid
      
    }
    console.log(data)
    console.log(object)
    // console.log(Grid)
    // console.log(Sv)
    // console.log(Dv)
    // console.log(en)
         

  return (
    <div>
       <input type="file" name='file' accept='.csv' onChange={handlefile} style={{display:"block",margin:'10px auto'}}></input>

<div style={{width:"900px",height:"400px",marginLeft:'100px'}}> 
    {/* <table> 
        <thead> 
            <tr>
                {
                    columnArray.map((col,i)=>( 
                        <th key={i}>
                            {col} 

                        </th>
                    ))
                    }

            </tr>

        </thead>

    </table> */}
    {/* <Line data={graphdata2} options={options} /> */}
    <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={300}
          height={300}
          data={object}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Energy" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="Solar" stroke="red" activeDot={{ r: 8 }}  />
          <Line   yAxisId="right" type="monotone" dataKey="Grid" stroke="navy" />
          <Line  yAxisId="left" type="monotone" dataKey="Diesel" stroke="green" />
        </LineChart>
      </ResponsiveContainer>
</div>

</div>
  )
}

export default Documentation
