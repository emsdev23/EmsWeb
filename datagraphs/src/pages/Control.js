import React, { useState,useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';
import { batteryData } from './Apicalling';
import Dropdown from 'react-bootstrap/Dropdown';
import { TiBatteryHigh } from "react-icons/ti";
import {TiBatteryLow} from "react-icons/ti"
import {TiBatteryFull} from "react-icons/ti"
import {FaBatteryEmpty} from "react-icons/fa"
import { height } from '@mui/system';




const host = 'localhost'

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
  const [batterydata,setBatterydata]=useState([])
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  const batteryurl=`http://${host}:5000/battery`


//  function batteryData() {
//     return axios.get(batteryurl)
//       .then(response => {
//         // Process the data here
//         return response.data;
//       })
//       .catch(error => {
//         console.error(error);
//       });
//   }

  const batteryData=()=>{
    axios.get(batteryurl).then((res)=>{
      const dataResponse=res.data
      setBatterydata(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  // batteryData()

  useEffect(()=>{
    // setInterval(()=>{},30000)
      batteryData()
    
   
  },[])

  console.log(batterydata)
 const packSoc=[]
 const currentStatus=[]
 const CHG=[]
 const chgtime=[]
 const DCHG=[]
 const dscgtime=[]

  for(let i=0;i<batterydata.length;i++){
    packSoc.push(batterydata[i].pack_usable_soc)
    currentStatus.push(batterydata[i].batteryStatus)
    if(batterydata[i].batteryStatus==="CHG"){
      CHG.push((batterydata[i].chargingAVG).toFixed(2))
      chgtime.push(batterydata[i].timestamp)
     
    }
    if(batterydata[i].batteryStatus==="DCHG"){
      DCHG.push((batterydata[i].dischargingAVG).toFixed(2))
      dscgtime.push(batterydata[i].timestamp)
     
    }
}


const val=CHG[CHG.length - 1]
const time=chgtime[chgtime.length-1]
const date = new Date(time);
const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const formattedTimestamp = date.toLocaleString('en-US', options);
//console.log(formattedTimestamp.split(",")[1])

const distime=dscgtime[dscgtime.length-1]
const disdate = new Date(distime);
const disoptions = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
const disformattedTimestamp = disdate.toLocaleString('en-US', options);
console.log(distime)




// const date = time.toLocaleString()

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
        const response =  axios.post(`http://${host}:5000/controlls`,formattedData);
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
      const response =  axios.post(`http://${host}:5000/instantaneous`, insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      swal({
        title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge ON ":"battery set to discharge mode",
        //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
        icon: "success",
      }).then(()=>{
        setIsButtonDisabled(true)
      })
      


    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
   }
   else if(insformatedData.batterystatus==="charge" && insformatedData.functioncode===2){
    insformatedData.functioncode=2
    try {
      const response =  axios.post(`http://${host}:5000/instantaneous`, insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      swal({
        title:insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge mode":"battery set to discharge mode",
        //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
        icon: "success",
      });
    } catch (error) {
      console.error(error);
      //console.log(formattedData)
    }
    console.log(insformatedData.functioncode)
   

   }
   else if(insformatedData.batterystatus==="discharge" && insformatedData.functioncode===1){
    insformatedData.functioncode=3
    try {
      const response =  axios.post(`http://${host}:5000/instantaneous`, insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      swal({
        title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge mode":"battery set to discharge mode",
        //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
        icon: "success",
      })
   
   
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
      const response =  axios.post(`http://${host}:5000/instantaneous`, insformatedData);
      //const result=response.data
      setInsformData({
        functioncode:"",
        batterystatus:""

      })
      console.log(insformatedData)
      swal({
        title: insformatedData.batterystatus==="charge" && insformatedData.functioncode===1 ?"battery set to charge mode":"battery set to discharge mode",
        //text: formattedData.functioncode ===1 ?"battery set to charge mode":"battery set to discharge mode",
        icon: "success",
      });
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

  //console.log(packSoc)
 

  

  return (
    <>
    <div> 

   
      <div >
        <h1 style={{textAlign:'center'}}><b>UPS Battery Control</b></h1>
      </div>
      <br/>

      <div  class="row" style={{marginLeft:'3px'}}>
         
      <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b>Overview</b></h4>
      <br/>
      <div >
    <div class="card" style={{background:"#b8bdcc",width:"auto"}}>
      <div class="card-body">
        <h3> Pack SoC(%): <b>{Math.round(packSoc[packSoc.length-1])}</b></h3>
        <h3>Current Status:<b>{currentStatus[currentStatus.length-1]}</b></h3>
        <div style={{width:'400px'}}> 
        {
          packSoc[packSoc.length-1] >=30 ? <TiBatteryFull size ={100} width="100%"/>:<TiBatteryLow size={100} width="100%"/>
        }

      
        </div>
        
        <h3>Last Charge: {val?<span style={{color:"red"}}>{(val)} kWh | </span>:<span style={{fontSize:"20px"}}>yet to charge</span>} </h3>
        {formattedTimestamp!=="Invalid Date"?<p>{formattedTimestamp}</p>:<p>_______</p>}
        {/* <p>{formattedTimestamp}</p> */}
        <h3>Last Discharge: {DCHG[DCHG.length-1]?<span style={{color:"red"}}>{Math.round(DCHG[DCHG.length-1])} kWh | </span>: <span style={{fontSize:"20px"}}>yet to discharge</span>} </h3>
        {disformattedTimestamp!=="Invalid Date"?<p>{disformattedTimestamp}</p>:<p>_______</p>}
        <h1></h1>
      </div>
    </div>
    </div>
  </div>

      <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b>Scheduled Control</b></h4>
      <br/>
    <div class="card" style={{background:"#b8bdcc",width:"auto", height:"380px"}} >
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={handleSubmit} >
      &nbsp;
        &nbsp;
        
      <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01">Status</label>
  <select class="form-select" id="inputGroupSelect01" value={formData.functioncode} onChange={(e) => setFormData({ ...formData, functioncode: e.target.value })}>
  {/* <option value=""> Options</option> */}
          <option value={0}>IDLE</option>
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
  <br/>
  <button type="submit" class="btn btn-primary" style={{height:"40px"}}>Submit</button>

  </form>

      </div>
    </div>
  </div>
  
  <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0" >
  <h4 style={{textAlign:"center"}}><b>Instantaneous Control</b></h4>
  <br/>
    <div class="card" style={{background:"#b8bdcc",width:"auto",height:"380px"}}>
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={instantaneousSubmit}> 
  <div class="row">
  <div class="col-sm-6">
    <div class="cards">
      <div class="card-body">
        {/* <h5 class="card-title">Battery Charge</h5> */}

        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" >Status </label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.batterystatus} onChange={(e) => setInsformData({ ...insformData, batterystatus: e.target.value })}>
  <option value="">Charge/Discharge</option>
        <option value="charge">Charge</option>
        <option value="discharge">Discharge</option>
  </select>
  </div>
        <br/>
        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01">Function</label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.functioncode} onChange={(e) => setInsformData({ ...insformData, functioncode: e.target.value })}>
  <option value=""> On/Off</option>
        <option value={1}>ON</option>
        <option value={2}>OFF</option>
  </select>
  </div>
      <br/>
      {
        isButtonDisabled=== true? <button type="submit" class="btn btn-primary" style={{height:"40px"}}>Submit</button>:<button type="button" class="btn btn-secondary btn-lg" disabled>Submit</button>
      }

     
      </div>
    </div>
  </div>
</div>
</form>
       
      </div>
    </div>
  </div>

  
</div>



  
  </div>

    </>
  );
}

export default Control;

// ------------------------------------------------
//  ---------------flip card----------
// <div class="flip-card">
//   <div class="flip-card-inner">
//     <div class="flip-card-front">
//       {/* <img src="img_avatar.png" alt="Avatar" style={{width:'300px',height:'300px'}}/> */}
//       <h1 style={{justifyContent:"center",alignItems:"center",display:'flex'}}>Card summary</h1>
//     </div>
//     <div class="flip-card-back">
//       {/* <h1>John Doe</h1> 
//       <p>Architect & Engineer</p> 
//       <p>We love that guy</p> */}
//     </div>
//   </div>
// </div>
// ------------------card styling---------------
// .flip-card {
//   background-color: transparent;
//   width: 300px;
//   height: 300px;
//   perspective: 1000px;
// }

// .flip-card-inner {
//   position: relative;
//   width: 100%;
//   height: 100%;
//   text-align: center;
//   transition: transform 0.6s;
//   transform-style: preserve-3d;
//   box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
// }

// .flip-card:hover .flip-card-inner {
//   transform: rotateY(180deg);
// }

// .flip-card-front, .flip-card-back {
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   -webkit-backface-visibility: hidden;
//   backface-visibility: hidden;
// }

// .flip-card-front {
//   background-color: #bbb;
//   color: black;
// }

// .flip-card-back {
//   background-color: #2980b9;
//   color: white;
//   transform: rotateY(180deg);
// }

	
