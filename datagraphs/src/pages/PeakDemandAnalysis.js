import React, { useState, useEffect,useRef  } from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';




function PeakDemandAnalysis() {
    const host="localhost"
    const [PeakDemandAnalysis1,setPeakDemandAnalysis1]=useState([])
    const [PeakDemandHourlyAnalysis,setPeakDemandHourlyAnalysis]=useState([])
    const [sunmOfEnergy,setSumOfEnergy]=useState([])

    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [singledaydata,setSingledaydata]=useState([])
    const [PeakDemandHourlyAnalysisFiltered,setPeakDemandHourlyAnalysisFiltered]=useState([])
    const [sumOfEnergyFiltered,setSumOfEnergyFiltered]=useState([])


     //---------function to handle change in inputTag----------------//
     const handleDateChange = (selectedDate) => {
      setSelectedDate(selectedDate);
    };

    //const [graphdata,setGraphdata]=useState=([])
  exportingInit(Highcharts);
  exportDataInit(Highcharts);


  
//--------------------------filtering date wise data---------------------//
const fetchData = async () => {
  setLoading(true);
  try {
    const formattedStartDate = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';

    const response = await axios.post(`http://${host}:5000/PeakDemand/Dashboard/Analysis/DateFiltered`, {date: formattedStartDate});
    const PeakDemandHourly_response = await axios.post(`http://${host}:5000/PeakDemand/Analysis/Hourly/DateFiltered`, {date: formattedStartDate});
    const SumOfEnergy = await axios.post(`http://${host}:5000/PeakDemand/Analysis/SumOfEnergy/dateFiltered`, {date: formattedStartDate});
  
    setSingledaydata(response.data);
    setPeakDemandHourlyAnalysisFiltered(PeakDemandHourly_response.data)
    setSumOfEnergyFiltered(SumOfEnergy.data)
    setLoading(false);
    console.log(formattedStartDate)
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
};


useEffect(() => {
  fetchData();
}, [selectedDate]);
//-------------------------END---------------------------------------------//


console.log(singledaydata)

  //------------peak raw details-----------------//
  useEffect(() => {
    axios.get(`http://${host}:5000/PeakDemand/Dashboard/Analysis`)
      .then((res) => {
        const dataResponse = res.data;
        setPeakDemandAnalysis1(dataResponse);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

//--------------------end -----------------//

//--------------peak hourly analysis----------------//
useEffect(() => {
  axios.get(`http://${host}:5000/PeakDemand/Analysis/Hourly`)
    .then((res) => {
      const dataResponse = res.data;
      setPeakDemandHourlyAnalysis(dataResponse);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);
//-----------------------end----------------------------//

//---------------------Sum of energy --------------//
useEffect(() => {
  axios.get(`http://${host}:5000/PeakDemand/Analysis/SumOfEnergy`)
    .then((res) => {
      const dataResponse = res.data;
      setSumOfEnergy(dataResponse);
    })
    .catch((err) => {
      console.log(err);
    });
}, []);
//-------------------------end------------------//
const Time=[]
const percentageOf_4100_TO_4200=[]
const percentageOf_4200_TO_4300=[]
const percentageOf_4300_TO_4400=[]
const percentageOf_4400_TO_4500=[]
const percentageOf_4500_TO_4600=[]
const percentageOf_4600=[]

if(selectedDate==null){
  let levelWisePercentageGraph = PeakDemandAnalysis1.map((data) => data.LevelWisePercentage);
let levelWisePercentageGraphEneResult = levelWisePercentageGraph[0];

console.log(levelWisePercentageGraph);


if (Array.isArray(levelWisePercentageGraphEneResult)) {
  levelWisePercentageGraphEneResult.map((value) => {
    Time.push(value.Time);
    percentageOf_4100_TO_4200.push(value.CountLevecrossLimit1_4100To4200_Percentage)
    percentageOf_4200_TO_4300.push(value.CountLevecrossLimit1_4200To4300_Percentage)
    percentageOf_4300_TO_4400.push(value.CountLevecrossLimit1_4300To4400_Percentage)
    percentageOf_4400_TO_4500.push(value.CountLevecrossLimit1_4400To4500_Percentage)
    percentageOf_4500_TO_4600.push(value.CountLevecrossLimit1_4500To4600_Percentage)
    percentageOf_4600.push(value.CountLevecrossLimit6_4600)
  });
} else {
  console.error("levelWisePercentageGraphEneResult is not an array or is undefined");
}

}
else{
  let levelWisePercentageGraph = singledaydata.map((data) => data.LevelWisePercentage);
let levelWisePercentageGraphEneResult = levelWisePercentageGraph[0];

console.log(levelWisePercentageGraph);
if (Array.isArray(levelWisePercentageGraphEneResult)) {
  levelWisePercentageGraphEneResult.map((value) => {
    Time.push(value.Time);
    percentageOf_4100_TO_4200.push(value.CountLevecrossLimit1_4100To4200_Percentage)
    percentageOf_4200_TO_4300.push(value.CountLevecrossLimit1_4200To4300_Percentage)
    percentageOf_4300_TO_4400.push(value.CountLevecrossLimit1_4300To4400_Percentage)
    percentageOf_4400_TO_4500.push(value.CountLevecrossLimit1_4400To4500_Percentage)
    percentageOf_4500_TO_4600.push(value.CountLevecrossLimit1_4500To4600_Percentage)
    percentageOf_4600.push(value.CountLevecrossLimit1_4600_Percentage)
  });
} else {
  console.error("levelWisePercentageGraphEneResult is not an array or is undefined");
}
}



console.log(percentageOf_4100_TO_4200)
//----------Peak graphs--------------//
const PeakDemandGraph={
  chart: {
      type: 'line'
  },
  title: {
      text: 'Percentage Of Apparent Power crossing 4100 kvA'
  },
  // subtitle: {
  //     text: 'Source: WorldClimate.com'
  // },
  xAxis: {
      categories:Time.map((Time)=>Time),
      crosshair: true
  },
  yAxis: {
      min: 0,
      title: {
          text: '% Of Apparent Power crossing 4100 kvA'
      }
  },
  tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
  },
  plotOptions: {
      column: {
          pointPadding: 0.2,
          borderWidth: 0
      }
  },
  series: [{
      name: '%4100-4200',
      data:percentageOf_4100_TO_4200.map((value)=>(value)),
      //type: 'column'

  },
  {
    name: '%4200-4300',
    data:percentageOf_4200_TO_4300.map((value)=>(value)),
    //type: 'column'

},
{
  name: '%4300-4400',
  data:percentageOf_4300_TO_4400.map((value)=>(value)),
  //type: 'column'

},
{
  name: '%4400-4500',
  data:percentageOf_4400_TO_4500.map((value)=>(value))

},
{
  name: '%4500-4600',
  data:percentageOf_4500_TO_4600.map((value)=>(value))

},
{
  name: '%4600',
  data:percentageOf_4600.map((value)=>(value))

}]
};
//-----------------END-----------------------//



  let maxDemand=0
  let MaxDemandTime=""
  let CountLevecrossLimit1_4100To4200=0
  let CountLevecrossLimit2_4200To4300=0
  let CountLevecrossLimit3_4300To4400=0
  let CountLevecrossLimit4_4400To4500=0
  let CountLevecrossLimit5_4500To4600=0
  let CountLevecrossLimit6_4600=0
  let CountAbove_4100=0
  let CountBellow_4100=0
  let CountAbovePercentage_4100=0
  let countBellowPercentage_4100=0
  let countLevelZero_Fivety=0
  let countLeve2Fivety_Hundred=0
  let countLeve3Hundred_oneFivety=0
  let countLeve4oneFivety_twohundred=0
  let countLeve5twohundred_twoFifty=0
  let countLeve6twoFifty=0
  let countLevelZero_FivetyPercentage=0
  let countLevel2Fivety_HundredPercentage=0
  let countLevel3Hundred_oneFivetyPercentage=0
  let countLeve4oneFivety_twohundredPercentage=0
  let countLeve5twohundred_twoFiftyPercentage=0
  let countLeve6twoFiftyPercentage=0



  if (selectedDate==null){
    for(let i=0;i<PeakDemandAnalysis1.length;i++){
      maxDemand=PeakDemandAnalysis1[i].maxDemand
      MaxDemandTime=PeakDemandAnalysis1[i].MaxDemandTime
      CountLevecrossLimit1_4100To4200=PeakDemandAnalysis1[i].CountLevecrossLimit1_4100To4200
      CountLevecrossLimit2_4200To4300=PeakDemandAnalysis1[i].CountLevecrossLimit2_4200To4300
      CountLevecrossLimit3_4300To4400=PeakDemandAnalysis1[i].CountLevecrossLimit3_4300To4400
      CountLevecrossLimit4_4400To4500=PeakDemandAnalysis1[i].CountLevecrossLimit4_4400To4500
      CountLevecrossLimit5_4500To4600=PeakDemandAnalysis1[i].CountLevecrossLimit5_4500To4600
      CountLevecrossLimit6_4600=PeakDemandAnalysis1[i].CountLevecrossLimit6_4600
      CountAbove_4100=PeakDemandAnalysis1[i].CountAbove_4100
      CountBellow_4100=PeakDemandAnalysis1[i].CountBellow_4100
      CountAbovePercentage_4100=PeakDemandAnalysis1[i].CountAbovePercentage_4100
      countBellowPercentage_4100=PeakDemandAnalysis1[i].countBellowPercentage_4100
      countLevelZero_Fivety=PeakDemandAnalysis1[i].countLevelZero_Fivety
      countLeve2Fivety_Hundred=PeakDemandAnalysis1[i].countLeve2Fivety_Hundred
      countLeve3Hundred_oneFivety=PeakDemandAnalysis1[i].countLeve3Hundred_oneFivety
      countLeve4oneFivety_twohundred=PeakDemandAnalysis1[i].countLeve4oneFivety_twohundred
      countLeve5twohundred_twoFifty=PeakDemandAnalysis1[i].countLeve5twohundred_twoFifty
      countLeve6twoFifty=PeakDemandAnalysis1[i].countLeve6twoFifty
      countLevelZero_FivetyPercentage=PeakDemandAnalysis1[i].countLevelZero_FivetyPercentage
      countLevel2Fivety_HundredPercentage=PeakDemandAnalysis1[i].countLevel2Fivety_HundredPercentage
      countLevel3Hundred_oneFivetyPercentage=PeakDemandAnalysis1[i].countLevel3Hundred_oneFivetyPercentage
      countLeve4oneFivety_twohundredPercentage=PeakDemandAnalysis1[i].countLeve4oneFivety_twohundredPercentage
      countLeve5twohundred_twoFiftyPercentage=PeakDemandAnalysis1[i].countLeve5twohundred_twoFiftyPercentage
      countLeve6twoFiftyPercentage=PeakDemandAnalysis1[i].countLeve6twoFiftyPercentage
  }

  }
  else{
    for(let i=0;i<singledaydata.length;i++){
      maxDemand=singledaydata[i].maxDemand
      MaxDemandTime=singledaydata[i].MaxDemandTime
      CountLevecrossLimit1_4100To4200=singledaydata[i].CountLevecrossLimit1_4100To4200
      CountLevecrossLimit2_4200To4300=singledaydata[i].CountLevecrossLimit2_4200To4300
      CountLevecrossLimit3_4300To4400=singledaydata[i].CountLevecrossLimit3_4300To4400
      CountLevecrossLimit4_4400To4500=singledaydata[i].CountLevecrossLimit4_4400To4500
      CountLevecrossLimit5_4500To4600=singledaydata[i].CountLevecrossLimit5_4500To4600
      CountLevecrossLimit6_4600=singledaydata[i].CountLevecrossLimit6_4600
      CountAbove_4100=singledaydata[i].CountAbove_4100
      CountBellow_4100=singledaydata[i].CountBellow_4100
      CountAbovePercentage_4100=singledaydata[i].CountAbovePercentage_4100
      countBellowPercentage_4100=singledaydata[i].countBellowPercentage_4100
      countLevelZero_Fivety=singledaydata[i].countLevelZero_Fivety
      countLeve2Fivety_Hundred=singledaydata[i].countLeve2Fivety_Hundred
      countLeve3Hundred_oneFivety=singledaydata[i].countLeve3Hundred_oneFivety
      countLeve4oneFivety_twohundred=singledaydata[i].countLeve4oneFivety_twohundred
      countLeve5twohundred_twoFifty=singledaydata[i].countLeve5twohundred_twoFifty
      countLeve6twoFifty=singledaydata[i].countLeve6twoFifty
      countLevelZero_FivetyPercentage=singledaydata[i].countLevelZero_FivetyPercentage
      countLevel2Fivety_HundredPercentage=singledaydata[i].countLevel2Fivety_HundredPercentage
      countLevel3Hundred_oneFivetyPercentage=singledaydata[i].countLevel3Hundred_oneFivetyPercentage
      countLeve4oneFivety_twohundredPercentage=singledaydata[i].countLeve4oneFivety_twohundredPercentage
      countLeve5twohundred_twoFiftyPercentage=singledaydata[i].countLeve5twohundred_twoFiftyPercentage
      countLeve6twoFiftyPercentage=singledaydata[i].countLeve6twoFiftyPercentage
  }
  }
  




let HourlyPeakValue=[]

console.log(PeakDemandHourlyAnalysisFiltered)
if(selectedDate==null){
  for(let i=0;i<PeakDemandHourlyAnalysis.length;i++){
    HourlyPeakValue.push({"PaekHourly":PeakDemandHourlyAnalysis[i].PeakDemand,"PolledTime":PeakDemandHourlyAnalysis[i].PolledTime})
    console.log("updated initial data")
  
  }
}

else{
  for(let i=0;i<PeakDemandHourlyAnalysisFiltered.length;i++){
    HourlyPeakValue.push({"PaekHourly":PeakDemandHourlyAnalysisFiltered[i].PeakDemand,"PolledTime":PeakDemandHourlyAnalysisFiltered[i].PolledTime})
  
    console.log("updated filtered data")
  }
}


console.log(HourlyPeakValue)

const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [month, day, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
const dateValue = selectedDate ? new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;
  return (
    <div> 

<div> 
        <h2 style={{textAlign:"center",marginTop:"10px"}}><b>Peak Demand Statistics Between 09:00 - 19:00</b> </h2>
      </div>

         <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col-10">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b> Date :- </b></h5><DatePicker id="date" selected={selectedDate} onChange={handleDateChange} />
        </label>
      </div>
     
    </div>
  </div>
  <div class="col-2"><h3>{dateValue}</h3></div>

 
</div>
       
    
    <div style={{marginTop:"40px",marginLeft:"10px",marginRight:"10px"}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
         
          <div> 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Maximum Demand Of The  Day(kvA)</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td> Max of Demand (kVA)</td>
            <td> Time</td>
        </tr>
    </thead>
    <tbody> 
        <tr style={{color:"skyblue"}}> 
            <td>{maxDemand}</td>
            <td>{MaxDemandTime}</td>
        </tr>
    </tbody>
</table>
        </div>
       
        </Grid>
        <Grid item xs={6}>
          
          <div style={{}}> 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Count Of Apparent Power crossing 4100 kvA Between 09:00-19:00hrs</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr > 
            <td>4100-4200 (kvA)</td>
            <td>4200-4300 (kvA)</td>
            <td>4300-4400 (kvA)</td>
            <td>4400-4500 (kvA)</td>
            <td>4500-4600 (kvA)</td>
            <td>4100-4200 (kvA)</td>
        </tr>
    </thead>
    <tbody> 
        <tr style={{color:"skyblue"}}> 
            <td>{CountLevecrossLimit1_4100To4200}</td>
            <td>{CountLevecrossLimit2_4200To4300}</td>
            <td>{CountLevecrossLimit3_4300To4400}</td>
            <td>{CountLevecrossLimit4_4400To4500}</td>
            <td>{CountLevecrossLimit5_4500To4600}</td>
            <td>{CountLevecrossLimit6_4600}</td>
        </tr>
    </tbody>
</table>
        </div>
   
        </Grid>
        <Grid item xs>
         
          <div > 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Sum of Energy (kWh) above 4300 kvA</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td style={{textAlign:"center"}}>Sum of  Energy kWh &gt; 4300 kvA</td>
        </tr>
    </thead>  
    <tbody> 
        <tr> 
            <td style={{textAlign:"center",color:"skyblue"}}>
              {
                selectedDate==null? sunmOfEnergy[0]:sumOfEnergyFiltered[0]
             
              
              }</td>
        </tr>
    </tbody>
    </table>
        </div>
        </Grid>
      </Grid>
    </Box>
     
    </div>

{/* -------------------------- */}
    <div style={{marginTop:"40px",marginLeft:"10px",marginRight:"10px"}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
         
          <div> 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Hours In Which Peak Demand crossed 4100 kvA</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td>Hours</td>
            <td>Demand &gt; 4100</td>
        </tr>
    </thead>
    <tbody> 
        {/* <tr style={{color:"tomato"}}> 
              {
                HourlyPeakValue.map((value)=>{
                   <td>{value.PaekHourly}</td> 
                })
              }
           
            <td>18:30</td>
        </tr> */}
        {
          selectedDate==null? PeakDemandHourlyAnalysis.map((PeakDemandHourlyAnalysis) => (
            <tr>
              <td>{(PeakDemandHourlyAnalysis.PolledTime).split(",")[1]}</td>
              <td>{PeakDemandHourlyAnalysis.PeakDemand}</td>
            </tr>
          )): PeakDemandHourlyAnalysisFiltered.map((PeakDemandHourlyAnalysisFiltered) => (
            <tr>
              <td>{(PeakDemandHourlyAnalysisFiltered.PolledTime).split(",")[1]}</td>
              <td>{PeakDemandHourlyAnalysisFiltered.PeakDemand}</td>
            </tr>
          ))
            
        
        
        }
      
    </tbody>
</table>
        </div>
       
        </Grid>
        <Grid item xs={6}>
          
          <div style={{}}> 
        {/* <h6 class="card-title" style={{textAlign:"center"}}><b>Count Of Apperent Power crossing 4100 kvA Between 09:00-19:00hrs</b></h6> */}
<HighchartsReact highcharts={Highcharts} options={PeakDemandGraph} height="300px" />
        </div>
   
        </Grid>
        <Grid item xs>
         
          <div > 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Peak Demand Count Statistics</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td>Count Of Demand Bellow 4100</td>
            <td>Count Of Demand Above 4100</td>
        </tr>
    </thead>
    <tbody> 
        <tr> 
            <td style={{textAlign:"center"}}>{CountBellow_4100}</td>
            <td style={{textAlign:"center"}}>{CountAbove_4100}</td>
        </tr>
    </tbody>
    </table>
        </div>
        <div > 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Percentage Of Peak Demand Variation</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td>Percentage Of Demand Bellow 4100</td>
            <td>Percentage Of Demand Above 4100</td>
        </tr>
    </thead>
    <tbody> 
        <tr> 
            <td style={{textAlign:"center"}}>
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar" role="progressbar" style={{ width: `100%`,color:"black",background:"#85BB65"}} aria-valuenow={countBellowPercentage_4100} aria-valuemin="0" aria-valuemax="100"><b>{countBellowPercentage_4100}%</b></div>
              </div>
            </td>
            <td>
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar" role="progressbar" style={{ width: `100%`,color:"black",background:"#85BB65"}} aria-valuenow={CountAbovePercentage_4100} aria-valuemin="0" aria-valuemax="100"><b>{CountAbovePercentage_4100}%</b></div>
              </div>
            </td>
        </tr>
    </tbody>
    </table>
        </div>
        </Grid>
      </Grid>
    </Box>
     
    </div>
    {/* ----------------------- */}
    <div style={{marginTop:"40px",marginLeft:"10px",marginRight:"10px"}}>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        <Grid item xs>
         
          <div> 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Count of Minute Wise Demand Variation</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td>0-50 kvA jump</td>
            <td>50-100 kvA jump</td>
            <td>100-150 kvA jump</td>
            <td>150-200 kvA jump</td>
            <td>200-250 kvA jump</td>
            <td>&gt;250 kvA jump</td>
        </tr>
    </thead>
    <tbody>
        <tr style={{color:"skyblue"}}> 
            <td>{countLevelZero_Fivety}</td>
            <td>{countLeve2Fivety_Hundred}</td>
            <td>{countLeve3Hundred_oneFivety}</td>
            <td>{countLeve4oneFivety_twohundred}</td>
            <td>{countLeve5twohundred_twoFifty}</td>
            <td>{countLeve6twoFifty}</td>
        </tr>
    </tbody>
</table>
        </div>
       
        </Grid>
        <Grid item xs={6}>
        <div> 
        <h6 class="card-title" style={{textAlign:"center"}}><b>Percentage of Minute Wise Demand Variation</b></h6>
        <table class="table table-dark table-hover">
    <thead> 
        <tr> 
            <td>% 0-50 kvA jump</td>
            <td>% 50-100 kvA jump</td>
            <td>% 100-150 kvA jump</td>
            <td>% 150-200 kvA jump</td>
            <td>% 200-250 kvA jump</td>
            <td>% &gt;250 kvA jump</td>
        </tr>
    </thead>
    <tbody> 
        <tr style={{color:"tomato"}}> 
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",background:"#85BB65"}} aria-valuenow={countLevelZero_FivetyPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLevelZero_FivetyPercentage}%</b></div>
              </div>
            </td>
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray",width:"100%"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",background:"#85BB65"}} aria-valuenow={countLevel2Fivety_HundredPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLevel2Fivety_HundredPercentage}%</b></div>
              </div>
            </td>
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",textAlign:"center",background:"#85BB65"}} aria-valuenow={countLevel3Hundred_oneFivetyPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLevel3Hundred_oneFivetyPercentage}%</b></div>
              </div>
            </td>
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",background:"#85BB65"}} aria-valuenow={countLeve4oneFivety_twohundredPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLeve4oneFivety_twohundredPercentage}%</b></div>
              </div>
            </td>
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",background:"#85BB65"}} aria-valuenow={countLeve5twohundred_twoFiftyPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLeve5twohundred_twoFiftyPercentage}%</b></div>
              </div>
            </td>
            <td> 
            <div class="progress" style={{height:"30px",color:"black",background:"gray"}}>
              <div class="progress-bar bg-primary" role="progressbar" style={{ width: `100%`,color:"white",background:"#85BB65"}} aria-valuenow={countLeve6twoFiftyPercentage} aria-valuemin="0" aria-valuemax="100"><b>{countLeve6twoFiftyPercentage}%</b></div>
              </div>

            </td>
        </tr>
    </tbody>
</table>
        </div>
        </Grid>
      </Grid>
    </Box>
    
     
    </div>
    </div>
  )
}

export default PeakDemandAnalysis
