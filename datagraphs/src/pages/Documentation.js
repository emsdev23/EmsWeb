import React, { useState, useEffect,useRef  } from 'react';
import BatteryCurrentvolt from './BatteryCurrentvolt'
import BatteryEnergyPac from './BatteryEnergyPac';


function Documentation() {


  return (
    <div> 
      <div > <h2 style={{textAlign:"center",margin:"20px",color:"black", fontSize:"40px",fontWeight:"bold",fontFamily:undefined, }}>48 kWh UPS Battery</h2></div>
  <br/>

  <div> 
  <BatteryEnergyPac/>
  </div>
  <hr style={{border:"10px solid black"}}/>
    <div> 
    <BatteryCurrentvolt/>
    </div>
          
    </div>
    
  );
}


export default Documentation
