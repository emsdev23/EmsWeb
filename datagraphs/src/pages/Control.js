import React, { useState } from 'react';
import axios from 'axios';





function Control() {
  const [selectValue, setSelectValue] = useState("");
  const [StartTime, setStartTime] = useState("");
  const [EndTime, setEndTime] = useState("");
  const [CapacityEnergy, setCapacityEnergy] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      selectValue:Number(selectValue),
      StartTime:Number(StartTime),
      EndTime:Number(EndTime),
      CapacityEnergy:Number(CapacityEnergy),
    };

    try {
      const response = await fetch("/controlls", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }

    console.log(formData)
  };


  return (
    <>
    <div>
      <div>
        <h1 style={{textAlign:'center'}}><b>UPS Battery Controll</b></h1>
      </div>
    <form onSubmit={handleSubmit} style={{marginTop:"50px",marginLeft:"50px"}}>
      <label>
        <span><b>Select:</b></span> 
        <select value={selectValue} onChange={(e) => setSelectValue(e.target.value)}>
          <option value="">Function Code</option>
          <option value={0}>IDEL</option>
          <option value={1}>CHG</option>
          <option value={2}>DCHG</option>
        </select>
      </label>
      <br />
      <br />
      <br />
      <label>
      <span><b>Start Time:</b></span>
        <input type="text" value={StartTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
      <br />
      <br />
      <br />
      <label>
      <span><b>End Time:</b></span>
        <input type="text" value={EndTime} onChange={(e) => setEndTime(e.target.value)} />
      </label>
      <br />
      <br />
      <br />
      <label>
      <span><b>Capacity Energy:</b></span>
        <input type="text" value={CapacityEnergy} onChange={(e) => setCapacityEnergy(e.target.value)} />
      </label>
      <br />
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
 

    </div>
    </>


  )
}

export default Control
