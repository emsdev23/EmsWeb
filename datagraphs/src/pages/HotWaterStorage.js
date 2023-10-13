import { useState,useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import axios from 'axios';
import RecirculationFlowrate from '../images/RecirculationFlowrate.jpg'
import FreshwaterFlowrate from "../images/FreshWaterFlowrate.png"
 

function HotWaterStorage() {
    const HotWaterData_Api='http://localhost:5000/HotWaterStorage'
   const [hotWaterData,setHotWaterData]=useState([])

   useEffect(() => {
    axios.get(HotWaterData_Api)
      .then((res) => {
        const dataResponse = res.data;
        setHotWaterData(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
       <div> 
        <h2 style={{textAlign:"center",}}><b>Hot Water Storage Dashboard</b></h2>
       </div>
       <div style={{margin:"50px"}}>
       <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
        <div>
        <div class="card" style={{width: "18rem",background:"gray",textAlign:"center"}}>
  <div class="card-body">
    <h5 class="card-title"><b style={{color:"white"}}>Fresh Water FlowRate</b></h5>
    <img src={FreshwaterFlowrate} width='200px' height="100px"/>
    <h3 style={{color:"white"}}>0</h3>
  </div>
</div>
        </div>
       
        </Grid>
        <Grid item xs={6}>
  <div>
    <div class="card" style={{ width: "18rem", background: "rgba(128, 128, 128, 0.5)" }}>
      <div class="card-body">
        <h5 class="card-title" style={{ color: 'whitesmoke' }}>Special title treatment</h5>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
        <img src={RecirculationFlowrate} width="100px" height="100px" style={{borderRadius:"50%"}}/>
      </div>
    </div>
  </div>
</Grid>

        <Grid item xs>
            <div> 

            </div>
        </Grid>
      </Grid>
    </Box>
    </div>
    </div>
  )
}

export default HotWaterStorage
