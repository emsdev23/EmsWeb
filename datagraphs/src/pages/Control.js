import React, { useState } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';

function Control() {
  const [formData, setFormData] = useState({
    functioncode: "",
    starttime: "",
    endtime: "",
    capacity: "",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formattedData = {
      functioncode: Number(formData.functioncode),
      starttime: formData.starttime,
      endtime: formData.endtime,
      capacity: Number(formData.capacity),
    };
    swal({
      title: "Are you sure?",
      text: "the given parameters will be set for battery!",
      icon: "warning",
      buttons: true,
      dangerMode: false,
    }).then(()=>{
      try {
        const response =  axios.post("http://localhost:5000/controlls", formattedData);
        const result=response.data
        setFormData({
          functioncode: "",
          starttime: "",
          endtime: "",
          capacity: "",
        });
        swal({
          title: "Details added to DB",
          text: result,
          icon: "success",
        });
      } catch (error) {
        console.error(error);
        console.log(formattedData)
      }

    })
    
  };

  const handleDateTimeChange = (moment, name) => {
    setFormData({
      ...formData,
      [name]: moment.format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  return (
    <>
      <div >
        <h1 style={{textAlign:'center'}}><b>UPS Battery Controll</b></h1>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'row' }}>
      &nbsp;
        &nbsp;
        
      <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01">Options</label>
  <select class="form-select" id="inputGroupSelect01" value={formData.functioncode} onChange={(e) => setFormData({ ...formData, functioncode: e.target.value })}>
  <option value="">Function Code</option>
          <option value={0}>IDEL</option>
          <option value={1}>CHG</option>
          <option value={2}>DCHG</option>
  </select>
  </div>
  &nbsp;
  &nbsp;
        

        <div style={{width:"300px"}}>
        <DateTime
           inputProps={{ placeholder: "Start Time" }}
           value={formData.starttime}
           onChange={(moment) => handleDateTimeChange(moment, "starttime")}
           dateFormat="YYYY-MM-DD"
           timeFormat="HH:mm:ss"
           
        />
        </div>
        &nbsp;
        &nbsp;
        

        <div style={{width:"300px"}}> 
        <DateTime
          inputProps={{ placeholder: "End Time" }}
          value={formData.endtime}
          onChange={(moment) => handleDateTimeChange(moment, "endtime")}
          dateFormat="YYYY-MM-DD"
          timeFormat="HH:mm:ss"
          style={{width:"300px"}}
        />
        </div>
        &nbsp;
        &nbsp;
        
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

    <input
          type="number"
          name="capacity"
          class="form-control"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          placeholder="Capacity"
          style={{width:"300px"}}
        />
  </div>
  &nbsp;
  &nbsp;
  <button type="submit" class="btn btn-primary" style={{height:"40px"}}>Submit</button>
  </form>
    </>
  );
}

export default Control;
