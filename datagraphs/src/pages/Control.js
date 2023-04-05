import React, { useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import CircularProgress from '@mui/material/CircularProgress';




function Control() {
  const [datavalue,setDatavalue]=useState(null)
  const [one,setOne]=useState(null)
 
  

  const url="http://localhost:5000/fetch"
  var timestamp=[]

      var idOne=[]
      var idTwo=[]
      var idThree=[]
      var idFour=[]
      var idfive=[]
      var idSix=[]
      var idSeven=[]
      var idEight=[]
      var inverteractivepower=[]
      var realdata=[]
    
      var twohors=[]
      var invertertemperature=[]

      
      axios.get(url).then((res)=>{
        // console.log(dataresponse)
        const dataresponse=res.data.filter((_, i) => i % 90 === 0);
        
        
        console.log(dataresponse)
        
        const two=dataresponse.filter((two)=>two.inverterdeviceid===2)
        const three=dataresponse.filter((three)=>three.inverterdeviceid===3)
        const four=dataresponse.filter((four)=>four.inverterdeviceid===4)
        const five=dataresponse.filter((five)=>five.inverterdeviceid===5)
        const six=dataresponse.filter((six)=>six.inverterdeviceid===6)
        const seven=dataresponse.filter((seven)=>seven.inverterdeviceid===7)
        const eight=dataresponse.filter((eight)=>eight.inverterdeviceid===8)
        setOne(one)
        idOne.push(one)
        idTwo.push(two)
        idThree.push(three)
        idFour.push(four)
        idfive.push(five)
        idSix.push(six)
        idSeven.push(seven)
        idEight.push(eight)

       

      }).catch((err)=>{
        console.log(err)
      })
   


      console.log(one)

      const data = [
        {
          name: "Page A",
          uv: 4000,
          pv: 2400,
          amt: 2400
        },
        {
          name: "Page B",
          uv: 3000,
          pv: 1398,
          amt: 2210
        },
        {
          name: "Page C",
          uv: 2000,
          pv: 9800,
          amt: 2290
        },
        {
          name: "Page D",
          uv: 2780,
          pv: 3908,
          amt: 2000
        },
        {
          name: "Page E",
          uv: 1890,
          pv: 4800,
          amt: 2181
        },
        {
          name: "Page F",
          uv: 2390,
          pv: 3800,
          amt: 2500
        },
        {
          name: "Page G",
          uv: 3490,
          pv: 4300,
          amt: 2100
        }
      ];


  return (
    <div style={{width:"100vw",height:"600px"}}>
     <LineChart
        width={1200}
        height={500}
        data={one}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="invertertimestamp"/>
        <YAxis />
        <Tooltip />
        <Legend />
        {/* <Line
          type="monotone"
          dataKey="inverterpowersetpoints
          "
          stroke="#8884d8"
          activeDot={{ r: 8 }}
        /> */}
        <Line type="monotone" dataKey="inverterenergy" stroke="blue" activeDot={{ r: 8 }}/>
      </LineChart>
      
 
    </div>
  )
}

export default Control
