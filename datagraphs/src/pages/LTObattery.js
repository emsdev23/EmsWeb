import React, { useState,useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';
import Swal from "sweetalert2"
import * as GiIcons from  'react-icons/gi'

function LTObattery() {

  const [ltoBatteryData,setLtoBatteryData]=useState([])
  const LTOApi='http://localhost:5000/battery/lto'


  const LTOData=()=>{
    axios.get(LTOApi).then((res)=>{
      const dataResponse=res.data
      setLtoBatteryData(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  useEffect(()=>{
    LTOData()
  },[])

console.log(ltoBatteryData)
let  Bvoltage=""
let Bcurrent=""
let BatteryStatus=""
let packSOC =""
let TimeStamp=""
let mainContactorStats=""
let prechargeContactorStatus=""

for(let i=0;i<ltoBatteryData.length;i++){
  Bvoltage=ltoBatteryData[i].batteryVoltage
  Bcurrent=ltoBatteryData[i].batteryCurrent
  if(ltoBatteryData[i].batteryStatus==="CHG"){
    BatteryStatus="CHARGING"

  }
  else if(ltoBatteryData[i].batteryStatus==="DCHG"){
    BatteryStatus="DISCHARGING"

  }
  else if(ltoBatteryData[i].batteryStatus==="IDLE"){
    BatteryStatus="IDEL"

  }
 
  packSOC=ltoBatteryData[i].packSOC
  TimeStamp=ltoBatteryData[i].polledTime
  mainContactorStats=ltoBatteryData[i].mainContactorStatus
  prechargeContactorStatus=ltoBatteryData[i].prechargeContactorStatus


}

  return (
    <div>
      <div >
        <h2 style={{fontSize:"30px",textAlign:"center"}}><b>LTO Battery Control</b></h2>
      </div>
      <br/>

      <div  class="row" style={{ marginLeft:'50px',marginRight:'50px'}}>
         
      <div style={{ display: 'inline-block' }} class="col-sm-6 mb-3 mb-sm-0">
  <h4 style={{ textAlign: "center" }}><b style={{ color: "brown" }}>Overview</b></h4>
  <br />
  <div>
    <div class="card" style={{ background: "white", width: "auto",height:"363px" }}>
      <div class="card-body" style={{ textAlign: "center" }}>
    
        <table style={{ width: "100%", textAlign: "left"}}>
          <tbody>
            <tr >
              <td><h4 style={{ color: "teal" }}><b>SoC(%)</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{packSOC}</h4></td>
            </tr>
            <tr> 
              <td> 
              <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar" role="progressbar" style={{ width: `${packSOC}%`,color:"white",background:"#85BB65"}} aria-valuenow={packSOC} aria-valuemin="0" aria-valuemax="100">{packSOC}%</div>
              </div>
              </td>
              <td></td>
              <td><h4 style={{color:"tomato"}}><b>{TimeStamp}</b></h4></td>
            </tr>
            <tr style={{marginTop:"30px"}}>
              <td><h4 style={{ color: "teal" }}><b>Current Status</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{BatteryStatus}</h4></td>
            </tr>
            {/* <tr> 
            {packSoc[packSoc.length - 1] >= 65  ? (
  <img src={batteryfull} alt="batteryfull" style={{ width: "100px", height: "100px" }} />
) : packSoc[packSoc.length - 1] <= 20 ? (
  <img src={batterylow} alt="batterylow" style={{ width: "100px", height: "100px" }} />
) : (
  <img src={image2} alt="batteryhalf" style={{ width: "100px", height: "100px" }} />
)}
            </tr> */}
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Battery Current (A)</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{Bcurrent}</h4></td>
            </tr>
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Battery Voltage (V)</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{Bvoltage}</h4></td>
            </tr>
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Main Contactor Status</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{mainContactorStats}</h4></td>
            </tr>
            <tr> 
              <td><h4  style={{ color: "teal" }}><b>Precharge Contactor Status</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{prechargeContactorStatus}</h4></td>
            </tr>
            {/* <tr> 
              <td><h4  style={{ color: "teal" }}><b>TimeStamp</b></h4></td>
              <td><h4>:</h4></td>
              <td><h4>{TimeStamp}</h4></td>
            </tr> */}
            
            
            {/* <tr>
              <td><h4 style={{ color: "teal" }}><b>Last Charge</b></h4></td>
              <td><h4>:</h4></td>
              <td>
                {val ? <h4 style={{ color: "black",fontSize:"20px" }}>{(Math.floor(val))} kWh  </h4> : <h4 style={{ fontSize: "20px",color:"gray" }}>yet to charge</h4>}
              </td>
              <td> 
              {formattedTimestamp!=="Invalid Date"?<span style={{ color: "gray",fontSize:"20px" }}>{formattedTimestamp}</span>:<p>_______</p>}
              </td>
              
            </tr> */}
            {/* <tr>
              <td><h4 style={{ color: "teal" }}><b>Last Discharge</b></h4></td>
              <td><h4>:</h4></td>
              <td>
                {DCHG[DCHG.length - 1] ? <h4 style={{ color: "black",fontSize:"20px"  }}>{Math.round(DCHG[DCHG.length - 1])} kWh  </h4> : <h4 style={{ fontSize: "20px",color:"gray" }}>yet to discharge</h4>}
              </td>
              <td> 
              {disformattedTimestamp!=="Invalid Date"?<span style={{ color: "gray",fontSize:"20px" }}>{disformattedTimestamp}</span>:<p>_______</p>}
              </td>
            </tr> */}
          </tbody>
        </table>
        <h1></h1>
      </div>
    </div>
  </div>
 </div>

  {/*<div style={{ display: 'inline-block'}} class="col-sm-6 mb-2 mb-sm-0" >
  <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Instantaneous Control</b></h4>
  <br/>
    <div class="card" style={{background:"white",width:"auto",height:"363px",marginLeft:"10px"}}>
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={instantaneousSubmit}> 
  <div class="row">
  <div class="col-sm-6">
    <div class="cards">
      <div class="card-body">

        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontSize:"18px"}} ><b>Status</b> </label>
      <select class="form-select" id="inputGroupSelect01" value={insformData.batterystatus} onChange={(e) =>setInsformData({ ...insformData, batterystatus: e.target.value })}>
  <option value="" disabled>CHARGE/DISCHARGE</option>
  <option value="charge" style={{ color: "green", fontSize: "17px" }}>CHARGE</option>
  <option value="discharge" style={{ color: "red" ,fontSize: "17px"}}>DISCHARGE</option>
</select>

  </div>
        <br/>
        <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontSize:"18px"}}><b>Function</b></label>
  <select class="form-select" id="inputGroupSelect01" value={insformData.functioncode} onChange={(e) => setInsformData({ ...insformData, functioncode: e.target.value })}>
  <option value="" disabled> ON/OFF</option>
        <option value={1}  style={{ color: "green", fontSize: "17px" }}>ON</option>
        <option value={2}  style={{ color: "red", fontSize: "17px" }}>OFF</option>
  </select>
  </div>
      <br/>

      <div class="input-group mb-3" style={{width:"300px"}}>
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1" style={{color:"gray"}}><b>PIN</b></span>
  </div>
  <input name="pin" type="password" class="form-control" placeholder="*****" aria-label="Username" aria-describedby="basic-addon1" onChange={handlePinPasswordChange}  value={pinNumber}/>
</div>
      <div style={{justifyItems:"center",marginLeft:"120px",justifyTracks:'center'}}> 
      {
        isButtonDisabled=== false ? <button type="submit" class="btn btn-primary bt-lg" style={{height:"40px"}}>Submit</button>:<button type="button" class="btn btn-secondary btn-lg" disabled>Submit</button>
      }

</div>
     
      </div>
    </div>
  </div>
</div>
</form>
       
      </div>
    </div>
  </div> */}

      {/* <div style={{ display: 'inline-block',marginTop:"40px"}} class="col-sm-12 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Scheduled Control</b></h4>
      <br/>
    <div class="card" style={{background:"white",width:"auto", height:"auto",marginLeft:"10px",marginBottom:"30px"}} >
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
     <BatteryShedule/>

      </div>
    </div>
  </div> */}



  
</div>
    </div>
  )
}

export default LTObattery
