import React, { useState, useEffect,useRef  } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ChillersStatus() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);

    const ChillerApi="http://localhost:5000/chillers/status"
    const [chillerData, setchillerData] = useState([]);

    const [data, setData] = useState([]);
    const [chillerfilterDate, setChillerilterDate] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(ChillerApi)
          .then((res) => {
            const dataResponse = res.data;
            setchillerData(dataResponse);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    console.log(chillerData)

    const handleEndDateChange = (date) => {
        setChillerilterDate(date);
      };


  
      const fetchChillerData = async () => {
        setLoading(true);
        try {
          const formattedStartDate = chillerfilterDate ? new Date(chillerfilterDate.getTime() - chillerfilterDate.getTimezoneOffset() * 60000).toISOString().substring(0, 10) : '';
      
          const response = await axios.post(`http://localhost:5000/Chillers/Datefilter`, {
            date: formattedStartDate,
          });
        
          setData(response.data);
          setLoading(false);
          console.log(formattedStartDate)
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      };


      useEffect(() => {
        fetchChillerData();
    }, [chillerfilterDate]);

    console.log(data)
    console.log(chillerfilterDate)



const chillersStatus = {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Chiller Status',
        align: 'center',
        style: {
            color: '#cc0000	', // You can replace 'red' with any desired color value
            fontSize:"30px"
        }
    },
  

    xAxis: {
        categories:chillerData.map((time)=>time.polledTime)
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'NO.OF Chillers'
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Chiller1',
        data: chillerData.map((chiller1)=>chiller1.chiller1Status),
        //stack: 'Europe'
    }, {
        name: 'Chiller2',
        data: chillerData.map((chiller2)=>chiller2.chiller2Status),
       // stack: 'Europe'
    }, {
        name: 'Chiller3',
        data:  chillerData.map((chiller3)=>chiller3.chiller3Status),
        //stack: 'North America'
    }, {
        name: 'Chiller4',
        data:  chillerData.map((chiller4)=>chiller4.chiller4Status),
        //stack: 'North America'
    },
    {
        name: 'Chiller5',
        data: chillerData.map((chiller5)=>chiller5.chiller5Status),
        //stack: 'Europe'
    }, {
        name: 'Chiller6',
        data: chillerData.map((chiller6)=>chiller6.chiller6Status),
       // stack: 'Europe'
    }, {
        name: 'Chiller7',
        data: chillerData.map((chiller7)=>chiller7.chiller7Status),
        //stack: 'North America'
    }, {
        name: 'Chiller8',
        data: chillerData.map((chiller8)=>chiller8.chiller8Status),
        //stack: 'North America'
    }]
};


const chillersStatusFiltered = {

    chart: {
        type: 'column'
    },

    title: {
        text: 'Chiller Status',
        align: 'center',
        style: {
            color: '#cc0000	', // You can replace 'red' with any desired color value
            fontSize:"30px"
        }
    },
  

    xAxis: {
        categories:data.map((time)=>time.timestamp)
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'NO.OF Chillers'
        }
    },
    tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
    },

    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Chiller1',
        data: data.map((chiller1)=>chiller1.chillar1),
        //stack: 'Europe'
    }, {
        name: 'Chiller2',
        data: data.map((chiller2)=>chiller2.chillar2),
       // stack: 'Europe'
    }, {
        name: 'Chiller3',
        data:  data.map((chiller3)=>chiller3.chillar3),
        //stack: 'North America'
    }, {
        name: 'Chiller4',
        data:  data.map((chiller4)=>chiller4.chillar4),
        //stack: 'North America'
    },
    {
        name: 'Chiller5',
        data: data.map((chiller5)=>chiller5.chillar5),
        //stack: 'Europe'
    }, {
        name: 'Chiller6',
        data: data.map((chiller6)=>chiller6.chillar6),
       // stack: 'Europe'
    }, {
        name: 'Chiller7',
        data: data.map((chiller7)=>chiller7.chillar7),
        //stack: 'North America'
    }, {
        name: 'Chiller8',
        data: data.map((chiller8)=>chiller8.chillar8),
        //stack: 'North America'
    }]
};



const now = new Date();
const local = now.toLocaleDateString(); // Use toLocaleDateString() instead of toLocaleString()
const [month, day, year] = local.split("/"); // Split the date by "/"
const currentdate = `${day}/${month}/${year}`; // Rearrange the day and month
const dateValue = chillerfilterDate ? new Date(chillerfilterDate.getTime() - chillerfilterDate.getTimezoneOffset() * 60000).toLocaleDateString('en-GB') : currentdate;

  return (
    <div>
    
        {/* <div className="row" style={{marginLeft:"10px",marginTop:"20px"}}>
  <div className="col-4">
    <div className="input-group mb-3" style={{ width: "300px"}}>
      <div className="input-group-prepend">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          <h5 style={{color:"brown"}}><b> Date :- </b></h5><DatePicker id="date" selected={chillerfilterDate} onChange={handleEndDateChange} />
        </label>
      </div>
     
    </div>
  </div>

 
</div> */}
<div class="row">
  <div class="col-10" > 
  <div className="input-group-prepend" style={{width:"270px",marginLeft:"30px"}}>
        <label className="input-group-text" htmlFor="inputGroupSelect01">
        <h5 style={{color:"brown"}}><b>Date :-</b></h5> <DatePicker id="date" className="form-control" selected={chillerfilterDate} onChange={handleEndDateChange} style={{ width: "200px" }}   />
        </label>
        
      </div>
  </div>
  <div class="col-2"><h3>{dateValue}</h3></div>
</div>
    
{
    chillerfilterDate===null?<HighchartsReact highcharts={Highcharts} options={chillersStatus} />:<HighchartsReact highcharts={Highcharts} options={chillersStatusFiltered} />
}

        
    </div>
  )
}

export default ChillersStatus
