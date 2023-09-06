import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import swal from 'sweetalert';

function Documentation() {
//   const [selectedDays, setSelectedDays] = useState([]);
//   const [chargestartTime, setChargestartTime] = useState('00:00');
//   const [chargeendTime, setChargeendTime] = useState('00:00');
//   const [dischargestarttime, setDischargestarttime] = useState('00:00');
//   const [dischargeendtime, setDischargeendtime] = useState('00:00');
//   const [slot2chargestartTime, setSlot2chargestartTime] = useState('00:00');
//   const [slot2chargeendTime, setSlot2chargeendTime] = useState('00:00');
//   const [slot2dischargestarttime, setSlot2dischargestarttime] = useState('00:00');
//   const [slot2dischargeendtime, setSlot2dischargeendtime] = useState('00:00');

//   const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

//   const handleDayClick = (day) => {
//     if (selectedDays.includes(day)) {
//       setSelectedDays(selectedDays.filter(selectedDay => selectedDay !== day));
//     } else {
//       setSelectedDays([...selectedDays, day]);
//     }
//   };

//   const handleChargeStartTimeChange = (event) => {
//     setChargestartTime(event.target.value);
//   };

//   const handleChargeEndTimeChange = (event) => {
//     setChargeendTime(event.target.value);
//   };

//   const handleDischargeStartTimeChange = (event) => {
//     setDischargestarttime(event.target.value);
//   };

//   const handleDischargeEndTimeChange = (event) => {
//     setDischargeendtime(event.target.value);
//   };

//   const handleSlot2ChargeStartTimeChange = (event) => {
//     setSlot2chargestartTime(event.target.value);
//   };

//   const handleSlot2ChargeEndTimeChange = (event) => {
//     setSlot2chargeendTime(event.target.value);
//   };

//   const handleSlot2DisChargeStartTimeChange = (event) => {
//     setSlot2dischargestarttime(event.target.value);
//   };

//   const handleSlot2DisChargeEndTimeChange = (event) => {
//     setSlot2dischargeendtime(event.target.value);
//   };
  

//   const handleSubmit = () => {
//     console.log(selectedDays)
//     const selectedData=[{
//       'selectedDay':selectedDays[0],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[1],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[2],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[3],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[4],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[5],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
//     {
//       'selectedDay':selectedDays[6],
//       'chargeStartTime':chargestartTime,
//       'chargeEndTime':chargeendTime,
//       'dischargeStartTime':dischargestarttime,
//       'dischargeEndTime':dischargeendtime

//     },
   
//   ]

//     console.log(selectedData);

//     const finalSelectedDays=[]
//     for(let i=0;i<selectedData.length;i++){
//       if(selectedData[i].selectedDay!==undefined){
//         finalSelectedDays.push({"seletedDay":selectedDays[i],"chargeStartTime":chargestartTime,"chargeEndTime":chargeendTime,"DischargeStartTime":dischargestarttime,"DischargeEndTime":dischargeendtime,"slot2ChargeStartTime":slot2chargestartTime,"slot2chargeEndTime":slot2chargeendTime,"slot2DischargeStartTime":slot2dischargestarttime,"slot2DischargeEndTime":slot2dischargeendtime})
//       }
//     }
//       swal({
//         title: "Are you sure?",
//         text: `the given parameters will be set for UpsBattery Shedule !`,
//         icon: "warning",
//         buttons: {
//           cancel: "Cancel",
//           confirm: "OK",
//         },
//         dangerMode: false,
//       }).then((willContinue) => {
//         if (willContinue) {
//           axios.post(`http://localhost:5000/Shedulecontroll/UPSBattery`, finalSelectedDays)
//             .then((response) => {
//               const result = response.data;
//               swal({
//                 title: result,
//                 icon: "success",
//               });
//             })
//             .catch((error) => {
//               console.error(error);
//               swal({
//                 title: "Error",
//                 text: "Failed to set  parameters",
//                 icon: "error",
//               });
//             });
//         }
//       });
  

    
    
//     console.log(finalSelectedDays)
//     setSelectedDays([]);
//     setChargestartTime("")
//     setChargeendTime("")
//     setDischargestarttime("")
//     setDischargeendtime("")
//  setSlot2chargestartTime("") 
//  setSlot2chargeendTime("");
// setSlot2dischargestarttime("");
//  setSlot2dischargeendtime("");
    

//   };


  return (
//     <div className="container">
//       <div className="d-flex" style={{justifyItems:'center',justifyContent:"center"}}>
//         {daysOfWeek.map(day => (
//           <div
//             key={day}
//             onClick={() => handleDayClick(day)}
//             className={`text-center p-2 ${selectedDays.includes(day) ? 'bg-success' : 'bg-dark'}`}
//             style={{ borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer', marginRight: '10px',color:"white" }}
//           >
//             <div style={{justifyItems:'center',justifyContent:"center"}}>{day.slice(0, 1)}</div>
//           </div>
//         ))}
//       </div>
//       <p className="mt-3" style={{fontFamily:"monospace",fontStyle:"italic"}}>Selected days: {selectedDays.join(', ')}</p>
      
//       <div>
//       <div class="container">
//       <div class="row" style={{justifyItems:'center',justifyContent:"center"}}>
//   <div class="col-6">

//     <h3 style={{color:"tomato",textAlign:"center"}}>
//       <b>Charge</b>
//     </h3>
//     <div class="accordion" id="accordionExample">
//   <div class="accordion-item">
//     <h2 class="accordion-header" id="headingOne">
//       <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
//        Slot1 
//       </button>
//     </h2>
//     <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
//       <div class="accordion-body">
//       <div className="mt-4" style={{justifyContent:"center"}}>
//         <label style={{marginRight:"10px"}}>Start Time:</label>
//         <input type="time" value={chargestartTime} onChange={handleChargeStartTimeChange} />
//         <br/>
//         <br/>
//         <label style={{marginRight:"10px"}}>End Time:</label>
//         <input type="time" value={chargeendTime} onChange={handleChargeEndTimeChange} />
        
//       </div>
//       </div>
//     </div>
//   </div>
//   <div class="accordion-item">
//     <h2 class="accordion-header" id="headingTwo">
//       <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
//         Slot2
//       </button>
//     </h2>
//     <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
//       <div class="accordion-body">
//       <div className="mt-4">
//         <label style={{marginRight:"10px"}}>Start Time:</label>
//         <input type="time" value={slot2chargestartTime} onChange={handleSlot2ChargeStartTimeChange} />
//         <br/>
//         <br/>
//         <label style={{marginRight:"10px"}}>End Time:</label>
//         <input type="time" value={slot2chargeendTime} onChange={handleSlot2ChargeEndTimeChange} />
//       </div>
//       </div>
//     </div>
//   </div>

// </div>


//   </div>
//   <div class="col-6"> 
//   <h3 style={{color:"tomato",textAlign:"center"}}> 
//     <b>Discharge</b>
//   </h3>

//   <div class="accordion" id="accordionExample">
//   <div class="accordion-item">
//     <h2 class="accordion-header" id="headingOne">
//       <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
//        Slot1 
//       </button>
//     </h2>
//     <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
//       <div class="accordion-body">
//       <div className="mt-4">
//         <label style={{marginRight:"10px"}}>StartTime:</label>
//         <input type="time" value={dischargestarttime} onChange={handleDischargeStartTimeChange} />
//         <br/>
//         <br/>
//         <label style={{marginRight:"10px"}}>End Time:</label>
//         <input type="time" value={dischargeendtime} onChange={handleDischargeEndTimeChange} />
//       </div>
//       </div>
//     </div>
//   </div>
//   <div class="accordion-item">
//     <h2 class="accordion-header" id="headingTwo">
//       <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
//         Slot2
//       </button>
//     </h2>
//     <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo" data-bs-parent="#accordionExample">
//       <div class="accordion-body">
//       <div className="mt-4">
//         <label style={{marginRight:"10px"}}>StartTime:</label>
//         <input type="time" value={slot2dischargestarttime} onChange={handleSlot2DisChargeStartTimeChange} />
//         <br/>
//         <br/>
//         <label style={{marginRight:"10px"}}>End Time:</label>
//         <input type="time" value={slot2dischargeendtime} onChange={handleSlot2DisChargeEndTimeChange} />
//       </div>
//       </div>
//     </div>
//   </div>
 
// </div>
// </div>
// </div>
// </div>

// <button className="btn btn-primary mt-4" onClick={handleSubmit}>
//           Submit
// </button>


//       </div>
     
      
//     </div>
<div> 
  <h1>Documentation</h1>
</div>
  );
}

export default Documentation;
