import React from 'react'
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { useState,useEffect } from 'react';

function Alerts() {
  
const host = "121.242.232.211"
const [alerts,setAlerts]=useState([])

  const AlertsData=()=>{
    axios.get(`http://${host}:5000/Alert/Logs`).then((res)=>{
      const dataResponse=res.data
      setAlerts(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  useEffect(()=>{
    AlertsData()
  },[])
console.log(alerts)



  return (
    <div> 
    <div >
        <h1 style={{textAlign:'center',marginTop:"30px"}}><b>Alert Logs</b></h1>
      </div>
      {/* <Dropdown >
      <Dropdown.Toggle variant="warning" id="dropdown-basic" style={{marginTop:"30px",width:"300px"}} >
        <b> Active Alerts </b>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item href="/Peakdemand">Peak Demand</Dropdown.Item>
        <Dropdown.Item href="/ChillerAlerts">Chiller</Dropdown.Item>
        <Dropdown.Item href="/Thermalalers">Thermal</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown> */}
  
     
      <Table striped bordered hover variant="dark" style={{ marginTop: "50px" }}>
  <thead>
    <tr>
      <th>Date</th>
      <th>System Name</th>
      <th>Alert</th>
      <th>Time</th>
      <th>Severity</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
    {alerts.map((data) => (
      <tr key={data.id}>
        <td>{data.alerttimereceived[0]}</td>
        <td>{data.systemName}</td>
        <td>{data.alert}</td>
        <td>{data.alerttimereceived[1]}</td>
        <td>{data.severity}</td>
        <td>{data.action}</td>
      </tr>
    ))}
  </tbody>
</Table>


     
    </div>
  )
}

export default Alerts
