import React from 'react'
import Table from 'react-bootstrap/Table';

function Alerts() {
  return (
    <div>
      <div> 
        
      </div>
     
    <Table striped bordered hover variant="dark"  style={{marginTop:"50px"}}>
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
        <tr>
          <td>13/4/2023</td>
          <td>Chiller</td>
          <td>Common Header Outlet Temparature limit has crossed 10°C</td>
          <td> 9:36:40 am</td>
          <td>High</td>
          <td>Mail sent</td>
        </tr>
        <tr>
          <td>13/4/2023</td>
          <td>Chiller</td>
          <td>Common Header Outlet Temparature limit has crossed 10°C</td>
          <td>10:46:40 am</td>
          <td>High</td>
          <td>Mail sent</td>
        </tr>
      </tbody>
    </Table>

     
    </div>
  )
}

export default Alerts
