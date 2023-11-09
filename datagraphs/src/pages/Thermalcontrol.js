import React, { useState,useEffect } from 'react';
import DateTime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import axios from 'axios';
import swal from 'sweetalert';
import Swal from "sweetalert2"
import * as GiIcons from  'react-icons/gi'


function Thermalcontrol() {
  const host='43.205.196.66'

  const [thermalData, setThermalData] = useState({
    functioncode: "",
    controlStatus: "",
    polledTime: "",
    // pin:""
  });

  const [thermalOverviewData,setThermalOverviewData]=useState([])
  const [thermallog,setThermallog]=useState([])
  const [pinNumber,setPinNumber]=useState("")
  const thermalApi=`http://${host}:5000/thermal/summaryCard`
  const thermalLogApi="http://localhost:5000/Logs/Thermal"
  const ActualPassKey=7230

  // const handlePinPasswordChange = (pin) => {
  //   setPinNumber(pin);
  // };

  const handlePinPasswordChange = (event) => {
    setPinNumber(event.target.value);
  };


  
  const ThermalData=()=>{
    axios.get(thermalApi).then((res)=>{
      const dataResponse=res.data
      setThermalOverviewData(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  const ThermalLogsData=()=>{
    axios.get(thermalLogApi).then((res)=>{
      const dataResponse=res.data
      setThermallog(dataResponse)
  
    }).catch((err)=>{
      console.log(err)
    })
  } 

  useEffect(()=>{
    ThermalData()
    ThermalLogsData()
  },[])

  console.log(thermalOverviewData)
  let  storedWaterTemp=""
  let inletTemparature=""
  let outletTemparature=""
  let thermalStoragelinepressure=""
  let flowrateToBuilding=""
  let flowrateToTS=""
  let ActuvatorStatus=""
  let ADPvalveStatus=""
  let BDPvalveStatus =""
  let HvalveStatus=""
  let Status=""
  for(let i=0;i<thermalOverviewData.length;i++){
    storedWaterTemp=thermalOverviewData[i].storedwatertemperature
    inletTemparature=thermalOverviewData[i].inletTemparature
    outletTemparature=thermalOverviewData[i].outletTemparature
    thermalStoragelinepressure=thermalOverviewData[i].thermalStoragelinepressure
    flowrateToBuilding=thermalOverviewData[i].flowrateToBuilding
    flowrateToTS=thermalOverviewData[i].flowrateToTS
    ActuvatorStatus=thermalOverviewData[i].ActuvatorStatus
    ADPvalveStatus=thermalOverviewData[i].ADPvalveStatus
    BDPvalveStatus=thermalOverviewData[i].BDPvalveStatus
    HvalveStatus=thermalOverviewData[i].HvalveStatus
    if(thermalOverviewData[i].chargingPump1Power>0 || thermalOverviewData[i].chargingPump2Power>0){
      Status="CHARGING"

    }
    if(thermalOverviewData[i].dischargingPump1Power>0 || thermalOverviewData[i].dischargingPump2Power>0){
      Status="DISCHARGING"

    }
    if(((thermalOverviewData[i].chargingPump1Power==0 || thermalOverviewData[i].chargingPump1Power==null) && (thermalOverviewData[i].chargingPump2Power==0|| thermalOverviewData[i].chargingPump2Power==null)) &&  ((thermalOverviewData[i].dischargingPump1Power==0 || thermalOverviewData[i].dischargingPump1Power==null) && (thermalOverviewData[i].dischargingPump2Power==0 || thermalOverviewData[i].dischargingPump2Power==null)) ){
      Status="IDLE"

    }



  }
//   {
//     "polledTime": "18:11",
//     "storedwatertemperature": 7.62,
//     "inletTemparature": 8.36,
//     "outletTemparature": 14.2,
//     "thermalStoragelinepressure": "6.250",
//     "flowrateToBuilding": 0,
//     "flowrateToTS": 61.74759,
//     "ActuvatorStatus": "ON",
//     "ADPvalveStatus": "ON",
//     "BDPvalveStatus": "ON",
//     "HvalveStatus": "ON",
//     "chargingPump1Power": 4262.37,
//     "chargingPump2Power": 0,
//     "dischargingPump1Power": 0,
//     "dischargingPump2Power": 0
// }


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
    console.log(pinNumber)
    if(parseInt(pinNumber)===ActualPassKey){
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
        axios.post(`http://${host}:5000/thermal/controll`, formattedData)
          .then((response) => {
            const result = response.data;
            setThermalData({
              functioncode: "",
              controlStatus: "",
              polledTime: "",
              // pin:"",
            });
            setPinNumber("")
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
  }
  else{
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'wrong! Pin',
      // footer: '<a href="">Why do I have this issue?</a>'
    })
  }
  };

  const handleDateTimeChange = (moment, name) => {
    setThermalData({
      ...thermalData,
      [name]: moment.format("YYYY-MM-DD HH:mm:ss"),
    });
  };

  // let TimeStamp=0
  // let cause=0
  // let DischargeOn=0
  // let DischargeOfTime=0
  // let PeakDeamndONTime=0
  // let PeakDeamndOFFTime=0
  // let peakTime=0
  // for(let i=0;i<thermallog.length;i++){

  // }


  const thermalLogPopup = () => {
    Swal.fire({
      width: "100vw",
      background: "white",
      html:
        '<table class="table table-dark table-hover" style="fontSize:5px">' +
        '<thead >' +
        '<tr >' +
        '<td>Record Date</td>' +
        '<td>cause</td>' +
        '<td>Discharge ON</td>' +
        '<td>charge OFF</td>' +
        '<td>PeakDemand OFF</td>' +
        '<td>PeakDemand ON</td>' +
        '<td>PeakTime</td>' +
        '<td>ServerTime</td>' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        // Removed extra tbody tag
        thermallog.map((data) => (
          '<tr>' +
          '<td>' + data.TimeStamp + '</td>' +
          '<td>' + data.cause + '</td>' +
          '<td>' + data.DischargeOn + '</td>' +
          '<td>' + data.DischargeOfTime +'</td>' + // Fixed typo here
          '<td>' + data.PeakDeamndONTime + '</td>' +
          '<td>' + data.PeakDeamndOFFTime + '</td>' +
          '<td>' + data.peakTime + '</td>' +
          '<td>' + data.serverTime + '</td>' +
          '</tr>'
        )).join('') +
        '</tbody>' +
        '</table>',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      // confirmButtonText: 'Yes, delete it!',
    });
  };
  
  

  
  

  return (
    <div>
      <div> 
      <button type="submit" class="btn btn-dark bt-lg" style={{height:"40px",width:"300px"}} onClick={thermalLogPopup}><b>Thermal Logs</b></button>
      </div>
      <div> 
        <h2 style={{fontSize:"30px",textAlign:"center"}}><b>Thermal Control</b></h2>
      </div>
      <div  class="row" style={{ margin:'30px'}}>
          <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Instantaneous Control</b></h4>
      <br/>
    <div class="card" style={{background:"white",width:"auto", height:"430px",marginLeft:"10px"}} >
      <div class="card-body" style={{justifyContent:"center",alignItems:'center',display:"flex"}}>
      <form onSubmit={handleThermalSubmit} >
      &nbsp;
        &nbsp;
        
      <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontFamily:"sans-serif",fontSize:"19px"}} ><b>Status</b></label>
  <select class="form-select" id="inputGroupSelect01" value={thermalData.controlStatus} onChange={(e) => setThermalData({ ...thermalData, controlStatus: e.target.value })}>
  <option value="">CHARGE/DISCHARGE</option>
          <option value={"charge"} style={{color:"green"}}>CHARGE</option>
          <option value={"discharge"} style={{color:"red"}}>DISCHARGE</option>
  </select>
  </div>

  <br/>
  <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontFamily:"sans-serif",fontSize:"19px"}} ><b>Function</b></label>
  <select class="form-select" id="inputGroupSelect01" value={thermalData.functioncode} onChange={(e) => setThermalData({ ...thermalData, functioncode: e.target.value })}>
  <option value="">ON/OFF</option>
          <option value={"ON"} style={{color:"green"}} >ON</option>
          <option value={"OFF"} style={{color:"red"}} >OFF</option>
  </select>
  </div>
  {/* <br/>
  <div class="input-group mb-3"  style={{width:"300px"}}>
      <label class="input-group-text" for="inputGroupSelect01" style={{color:"gray",fontFamily:"sans-serif",fontSize:"19px"}} ><b>PIN</b></label>
      <input name="pin" type="password"></input>
  </div> */}
  <br/>
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1" style={{color:"gray"}}><b>PIN</b></span>
  </div>
  <input name="pin" type="password" class="form-control" placeholder="*****" aria-label="Username" aria-describedby="basic-addon1" onChange={handlePinPasswordChange}  value={pinNumber}/>
</div>
  
  <br/>  

  <div style={{justifyContent:"center"}}> 
  {
    thermalData.controlStatus && thermalData.functioncode ?<button type="submit" class="btn btn-dark bt-lg" style={{height:"40px",width:"300px"}}><b>Submit</b></button>: <button type="button" class="btn btn-secondary btn-lg" disabled style={{height:"40px",width:"300px"}}><b>Submit</b></button>
  }
  
  </div>
  
  </form>

      </div>
    </div>
  </div>

  <div style={{ display: 'inline-block'}} class="col-sm-4 mb-3 mb-sm-0">
      <h4 style={{textAlign:"center"}}><b style={{color:"brown"}}>Overview</b></h4>
      <br/>
      <div >
    <div class="card" style={{background:"white",width:"600px"}}>
      <div class="card-body">
      <table style={{ width: "100%", textAlign: "left"}}>
          <tbody>
          <tr>
          <td><h4><b  style={{color:"teal"}}>Status</b></h4></td>
          <td><h4>:</h4></td>
          <td><h4>{Status}</h4></td>
          </tr>
          <tr> 
            <td> <h4><b style={{color:"teal"}}>Stored Water Temperature(&deg;C)</b></h4></td>
            <td><h4>:</h4></td>
            <td><h4>{storedWaterTemp}</h4></td>
          </tr>
          <tr> 
            <td> <h4><b style={{color:"teal"}}>Inlet Temperature (&deg;C)</b></h4></td>
            <td><h4>:</h4></td>
            <td><h4>{inletTemparature}</h4></td>
          </tr>
          <tr> 
            <td> <h4> <b style={{color:"teal"}}>Outlet Temperature (&deg;C)</b></h4></td>
            <td><h4>:</h4></td>
            <td><h4>{outletTemparature}</h4></td>
          </tr>
          <tr> 
            <td><h4> <b style={{color:"teal"}}>Line Pressure (Bar)</b></h4></td>
            <td><h4>:</h4></td>
            <td><h4>{thermalStoragelinepressure}</h4></td>
          </tr>
       
        {/* <h4><b  style={{color:"teal"}}>Status</b>:{Status}</h4>
        <h4><b style={{color:"teal"}}>Stored Water Temperature(deg C)</b> : {storedWaterTemp}</h4>
        <h4> <b style={{color:"teal"}}>Inlet Temperature (deg C)</b>: {inletTemparature}</h4>
        <h4> <b style={{color:"teal"}}>Out Temperature (deg C)</b>: {outletTemparature}</h4>
        <h4> <b style={{color:"teal"}}>Line Pressure (Bar)</b>: {thermalStoragelinepressure}</h4> */}
        </tbody>
        </table>
        <div> 
          <h4><b style={{color:"teal"}} >Flow Rate(m3/h)</b>:</h4>
          <div class="container">
  <div class="row" style={{marginLeft:"50px"}}>
    <div class="col" >
    <h5><b>To Building</b>: {flowrateToBuilding}</h5>
    {/* <h6 style={{textAlign:"center"}}></h6> */}
    </div>
    <div class="col">
    <h5><b>To TS</b>: {flowrateToTS}</h5>
    {/* <h6 style={{textAlign:"center"}}></h6> */}
    </div>
    </div>
   <div > 
    <h4><b style={{color:"teal"}}>Status </b>:</h4>
   </div>
    <div class="row">
    <div class="col">
   <p >Actuator</p>
   {
    ActuvatorStatus==="ON"? <GiIcons.GiValve color='green' size="70px"/>: <GiIcons.GiValve color='gray' size="70px"/>
   }
   
    {/* <h6 style={{textAlign:"center"}}></h6> */}
    </div>
    <div class="col">
    <p>ADP Valve</p>
    {
      ADPvalveStatus==="ON"?<GiIcons.GiValve color='green' size="70px"/>: <GiIcons.GiValve color='gray' size="70px"/>
    }
    </div>
    <div class="col">
    <p>BDP Valve</p>
    {
      BDPvalveStatus==="ON"?<GiIcons.GiValve color='green' size="70px"/>: <GiIcons.GiValve color='gray' size="70px"/>
    }
    </div>
    <div class="col">
    <p>H Valve</p>
    {
      HvalveStatus==="ON"?<GiIcons.GiValve color='green' size="70px"/>: <GiIcons.GiValve color='gray' size="70px"/>
    }
    </div>
    </div>
    
   
    </div>


          
          
        </div>
        
        
        
        
        
       

      
        </div>
      </div>
    </div>
    </div>
  </div>
  </div>
    
  )
}

export default Thermalcontrol
