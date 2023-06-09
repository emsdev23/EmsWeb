import './App.css';
// import Sidebar from './main';
// import Data from './Api'

import * as React from 'react';
import Navbar from './components/Navbar';

// import Navebar from './Navebar'
// import Analytics from './analytics';
// import Alerts from './alerts';
// import Control from './control';
// import Documentation from './documentation'
// import Dashboard from './Dashboard'
import DashBoard from './pages/DashBoard'
import Analytics from './pages/Analytics'
import Control from './pages/Control';
import Alerts from './pages/Alerts'
import Documentation from './pages/Documentation';
import Peakdemand from './pages/Peakdemand';
import Thermalalers from './pages/Thermalalers';
import ChillerAlerts from './pages/ChillerAlerts';
import axios from 'axios';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState,useEffect } from 'react';
import swal from 'sweetalert';
import Thermalcontrol from './pages/Thermalcontrol';
import Peakdemandgraph from './pages/Peakdemandgraph';


function App() {


  return (
    <> 
    <div > 

    
    <BrowserRouter>
    <Navbar/> 
    <Routes> 
      <Route  path ='/' element={<DashBoard/>}/>
      <Route  path ='/Analytics' element={<Analytics/>}/>
      <Route  path ='/Control/upsbattery' element={<Control/>}/>
      <Route  path ='/Control/thermal' element={<Thermalcontrol/>}/>
      
      <Route  path ='/Alertlogs' element={<Alerts/>}/>
      <Route  path ='/Documentation' element={<Documentation/>}/>
      <Route  path ='/Alerts/Peakdemand' element={<Peakdemand/>}/>
      <Route  path ='/Alerts/Thermalalers' element={<Thermalalers/>}/>
      <Route  path ='/Alerts/ChillerAlerts' element={<ChillerAlerts/>}/>
      <Route  path ='/peakgraph' element={<Peakdemandgraph/>}/>
      

      </Routes>

    
    </BrowserRouter>

    </div>





    </>
  );
}

export default App;


  {/*const host = "121.242.232.211"
  const url=`http://${host}:5000/PeakDemand`
  const thermalAlert=`http://${host}:5000/thermalalert`
  const outlettemp =`http://${host}:5000/outletTemparature`

  const PeakDemand=()=>{
    axios.get(url).then((res)=>{
      const dataResponse=res.data
    //   toast.warning(dataResponse, {
    //     position: toast.POSITION.CENTER_CENTER
    // });
    swal({
      title: "Alert",
      text: `${dataResponse} '\u{1F600}'`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      background: 'darkblue'
    }).then(() => {
      // This function will be called after the user closes the alert swal popup
      swal({
        title: "maile Send Success",
        text: "the Warning maile has been sent to the user!!!!!!",
        icon: "success",
      });
    });
  }).catch((err)=>{
      console.log(err)
    })
  } 

  
  const thermalAlerts=()=>{
    axios.get(thermalAlert).then((res)=>{
      const dataResponse=res.data
    //   toast.warning(dataResponse, {
    //     position: toast.POSITION.CENTER_CENTER
    // });
    swal({
      title: "Alert",
      text: `${dataResponse} '\u{1F600}'`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      background: 'darkblue'
    }).then(() => {
      // This function will be called after the user closes the alert swal popup
      swal({
        title: "maile Send Success",
        text: "the Warning maile has been sent to the user!!!!!!",
        icon: "success",
      });
    });
  }).catch((err)=>{
      console.log(err)
    })
  } 

  
  

  const OutletTemp=()=>{
    axios.get(outlettemp).then((res)=>{
      const dataResponse=res.data
    //   toast.warning(dataResponse, {
    //     position: toast.POSITION.CENTER_CENTER
    // });
    swal({
      title: "Alert",
      text: `${dataResponse} '\u{1F600}'`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      background: 'darkblue'
    }).then(() => {
      // This function will be called after the user closes the alert swal popup
      swal({
        title: "mail Send Successfully",
        text: "please check the mail.........",
        icon: "success",
      });
    });
  }).catch((err)=>{
      swal({
      title: "Alert",
      text: `${err} '\u{1F600}'`,
      icon: "warning",
      buttons: true,
      dangerMode: true,
      background: 'darkblue'
    })
    })
  } 

  





  useEffect(()=>{
    setInterval(()=>{
     OutletTemp()
    PeakDemand()
    thermalAlerts()
     
    },60000)
  })*/}
 





