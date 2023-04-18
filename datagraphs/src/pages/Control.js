import React, { useState } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';
import Dropdown from 'react-bootstrap/Dropdown';

function Control() {
  const [formData, setFormData] = useState({
    functioncode: "",
    starttime: "",
    endtime: "",
    capacity: "",
  });

  const [insformData,setInsformData]=useState({
    functioncode:"",
    batterystatus:""

  })
  // const [chargeOrDischarge, setChargeOrDischarge] = useState('');
  // const [functioncode, setFunctioncode] = useState('');

  // const handleChargeOrDischargeChange = (event) => {
  //   setChargeOrDischarge(event.target.value);
  // };

  // const handleOnOrOffChange = (event) => {
  //   setFunctioncode(event.target.value);
  // };

  

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
        const response =  axios.post("http://localhost:5000/controlls",formattedData);
        const result=response.data
        setFormData({
          functioncode: "",
          starttime: "",
          endtime: "",
          capacity: "",
        });
        swal({
          title: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
          //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
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

  const instantaneousSubmit = (event) => {
    event.preventDefault();
   const insformatedData={
    functioncode: Number(insformData.functioncode),
    batterystatus:insformData.batterystatus

   }

   if(insformatedData.batterystatus==="charge" && insformatedData.functioncode===1){
    insformatedData.functioncode=1
    try {
      const response =  axios.post("http://localhost:5000/instantaneous", insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      // swal({
      //   title: chargeOrDischarge === "charge" ?"battery set to charge mode":"battery set to discharge mode",
      //   //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
      //   icon: "success",
      // });
    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
   }
   else if(insformatedData.batterystatus==="charge" && insformatedData.functioncode===2){
    insformatedData.functioncode=2
    try {
      const response =  axios.post("http://localhost:5000/instantaneous", insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      // swal({
      //   title: chargeOrDischarge === "charge" ?"battery set to charge mode":"battery set to discharge mode",
      //   //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
      //   icon: "success",
      // });
    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
   

   }
   else if(insformatedData.batterystatus==="discharge" && insformatedData.functioncode===1){
    insformatedData.functioncode=3
    try {
      const response =  axios.post("http://localhost:5000/instantaneous", insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      // swal({
      //   title: chargeOrDischarge === "charge" ?"battery set to charge mode":"battery set to discharge mode",
      //   //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
      //   icon: "success",
      // });
    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
    console.log(insformatedData.functioncode)

   }
   else if(insformatedData.batterystatus==="discharge" && insformatedData.functioncode===2){
    insformatedData.functioncode=4
    try {
      const response =  axios.post("http://localhost:5000/instantaneous", insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      // swal({
      //   title: chargeOrDischarge === "charge" ?"battery set to charge mode":"battery set to discharge mode",
      //   //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
      //   icon: "success",
      // });
    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
    console.log(insformatedData.functioncode)

   }
    // try {
    //   const response =  axios.post("http://localhost:5000/instantaneous", insformatedData);
    //   //const result=response.data
    //   setInsformData({
    //     functioncode:"",
    //     chargeOrDischarge:""

    //   })
    //   console.log(typeof(functioncode))
    //   // swal({
    //   //   title: chargeOrDischarge === "charge" ?"battery set to charge mode":"battery set to discharge mode",
    //   //   //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
    //   //   icon: "success",
    //   // });
    // } catch (error) {
    //   console.error(error);
    //   //console.log(formattedData)
    // }
   
    // console.log(chargeOrDischarge,onOrOff)
    // if(chargeOrDischarge==="charge" && functioncode==="on"){
     
    // }
    // else if(chargeOrDischarge==="charge" && functioncode==="off"){
    //   console.log("2")

    // }
    // else if(chargeOrDischarge==="discharge" && functioncode==="on"){
    //   console.log("3")

    // }
    // else if(chargeOrDischarge==="discharge" && functioncode==="off"){
    //   console.log("4")

    // }
  

    // Make HTTP POST request to server
    // fetch('/api/submit-form', {
    //   method: 'POST',
    //   body: JSON.stringify({ name, email }),
    //   headers: {
    //     'Content-Type': 'application/json'
    //   }
    // })
    // .then(response => response.json())
    // .then(data => {
    //   // Reset form values
    //   setName('');
    //   setEmail('');
    // })
    // .catch(error => {
    //   console.error('Error submitting form:', error);
    // });
    console.log(insformatedData)
    
  };
 

  

  return (
    <>
    <div> 

   
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
  <br/>
        

        <div style={{width:"300px"}}>
        <DateTime
           inputProps={{ placeholder: "Start Time" }}
           value={formData.starttime}
           onChange={(moment) => handleDateTimeChange(moment, "starttime")}
           dateFormat="YYYY-MM-DD"
           timeFormat="HH:mm:ss"
           
        />
        </div>
      <br/>

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
  <br/>
  <button type="submit" class="btn btn-primary" style={{height:"40px"}}>Submit</button>

  </form>
  <br/>
  <br/>

  <form onSubmit={instantaneousSubmit}> 
  <div class="row">
  <div class="col-sm-6">
    <div class="cards">
      <div class="card-body">
        <h5 class="card-title">Battery Charge</h5>

         <div class="input-group mb-3"  style={{width:"400px"}}>
      <label class="input-group-text" for="inputGroupSelect01">Charge/Discharge</label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.batterystatus} onChange={(e) => setInsformData({ ...insformData, batterystatus: e.target.value })}>
  <option value="">Function Code</option>
        <option value="charge">Charge</option>
        <option value="discharge">Discharge</option>
  </select>
  </div>
        <br/>
       <div class="input-group mb-3"  style={{width:"400px"}}>
      <label class="input-group-text" for="inputGroupSelect01">On/Off:</label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.functioncode} onChange={(e) => setInsformData({ ...insformData, functioncode: e.target.value })}>
  <option value="">Function Code</option>
        <option value={1}>ON</option>
        <option value={2}>OF</option>
  </select>
  </div>
      <br/>

      <button type="submit" class="btn btn-primary" style={{height:"40px"}}>Submit</button>
      </div>
    </div>
  </div>
</div>
</form>
  
  </div>

    </>
  );
}

export default Control;
