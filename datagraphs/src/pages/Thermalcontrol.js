import React, { useState,useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';

function Thermalcontrol() {

  const [thermalData, setThermalData] = useState({
    functioncode: "",
    controlStatus: "",
    polledTime: ""
  });

  //const [thermaldata,setThermaldata]=useState([])

  var now = new Date();
  var formattedDate = now.getFullYear() + '-' + 
                      ('0' + (now.getMonth() + 1)).slice(-2) + '-' + 
                      ('0' + now.getDate()).slice(-2) + ' ' + 
                      ('0' + now.getHours()).slice(-2) + ':' + 
                      ('0' + now.getMinutes()).slice(-2) + ':' + 
                      ('0' + now.getSeconds()).slice(-2);
  
  console.log(formattedDate);


  const handleThermalSubmit = async (event) => {
    event.preventDefault();
    const formattedData = {
      functioncode: thermalData.functioncode,
      controlStatus: thermalData.controlStatus,
      polledTime: formattedDate,
    };
    console.log(formattedData)
    swal({
      title: "Are you sure?",
      text: `the given parameters will be set for Thermal control !`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "OK",
      },
      dangerMode: false,
    }).then((willContinue) => {
      if (willContinue) {
        axios.post(`http://localhost:5000/thermal/controll`, formattedData)
          .then((response) => {
            const result = response.data;
            setThermalData({
              functioncode: "",
              controlStatus: "",
              polledTime: "",
            });
            swal({
              title: (formattedData.functioncode === "ON" || formattedData.functioncode === "OFF" ) && formattedData.controlStatus === "discharge"?  `Thermal set to discharge ${formattedData.functioncode}  mode` : `Thermal set to charge ${formattedData.functioncode} mode`,
              icon: "success",
            });
          })
          .catch((error) => {
            console.error(error);
            swal({
              title: "Error",
              text: "Failed to set Thermal parameters",
              icon: "error",
            });
          });
      }
    });
  };

  const handleDateTimeChange = (moment, name) => {
    setThermalData({
      ...thermalData,
      [name]: moment.format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  return (
    <div>
      <div> 
        <h2 style={{fontSize:"30px",textAlign:"center"}}><b>Thermal Control</b></h2>
      </div>
          <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b>Instantaneous Control</b></h4>
      <br/>
    <div class="card" style={{background:"white",width:"auto", height:"380px",marginLeft:"10px"}} >
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={handleThermalSubmit} >
      &nbsp;
        &nbsp;
        
      <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontFamily:"sans-serif",fontSize:"19px"}} ><b>Status</b></label>
  <select class="form-select" id="inputGroupSelect01" style={{color:"red"}} value={thermalData.controlStatus} onChange={(e) => setThermalData({ ...thermalData, controlStatus: e.target.value })}>
  <option value="">CHARGE/DISCHARGE</option>
          <option value={"charge"} style={{color:"red"}}>CHARGE</option>
          <option value={"discharge"} style={{color:"red"}}>DISCHARGE</option>
  </select>
  </div>

  <br/>
  <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontFamily:"sans-serif",fontSize:"19px"}} ><b>Function</b></label>
  <select class="form-select" id="inputGroupSelect01" style={{color:"red"}} value={thermalData.functioncode} onChange={(e) => setThermalData({ ...thermalData, functioncode: e.target.value })}>
  <option value="">ON/OFF</option>
          <option value={"ON"} style={{color:"red"}} >ON</option>
          <option value={"OFF"} style={{color:"red"}} >OFF</option>
  </select>
  </div>
  <br/>
        

        {/* <div style={{width:"300px"}}>
        <DateTime
           inputProps={{ placeholder: "polledTime" }}
           value={thermalData.polledTime}
           onChange={(moment) => handleDateTimeChange(moment, "polledTime")}
           dateFormat="YYYY-MM-DD"
           timeFormat="HH:mm:ss"
           
        />
        </div> */}
      <br/>

        <br/>
        
        {/* <div class="mb-3">
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="Capacity"
          style={{width:"300px"}}
        />
  </div> */}
  <div class="mb-3">
{/* 
    <input
          type="number"
          name="capacity"
          class="form-control"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="Capacity"
          style={{width:"350px"}}
        /> */}
  </div>
  <div style={{justifyContent:"center"}}> 
  {
    thermalData.controlStatus && thermalData.functioncode ?<button type="submit" class="btn btn-dark bt-lg" style={{height:"40px",width:"300px"}}><b>Submit</b></button>: <button type="button" class="btn btn-secondary btn-lg" disabled style={{height:"40px",width:"300px"}}><b>Submit</b></button>
  }
  
  </div>
  
  </form>

      </div>
    </div>
  </div>
    </div>
  )
}

export default Thermalcontrol
