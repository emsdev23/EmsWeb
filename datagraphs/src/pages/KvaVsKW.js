import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import exportingInit from 'highcharts/modules/exporting';
import exportDataInit from 'highcharts/modules/export-data';
import axios from 'axios';
import HighchartsReact from 'highcharts-react-official';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function KvaVsKW() {
    exportingInit(Highcharts);
    exportDataInit(Highcharts);
    const host = '43.205.196.66';
    const KVA_KW_api = "http://localhost:5000/KVA_vs_KW";
    const [kva_kw_data,setKva_kw_data]=useState([])

    useEffect(() => {
        axios.get(KVA_KW_api)
            .then((res) => {
                const dataResponse = res.data;
                setKva_kw_data(dataResponse);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);


    
    const KvaKwGraph = {
            chart: {
                type: 'line'
            },
            title: {
                text: null
            },
            xAxis: {
                categories:kva_kw_data.map((Time) => Time.TimeStamp),
                crosshair: true
            },
            yAxis: [{
                min: 0,
                title: {
                    text: '(kW)'
                }
            }, {
                title: {
                    text: '(kvA)'
                },
                opposite: true // This makes the axis appear on the opposite side
            }],
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
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
                name: 'Peak Demand  (kvA)',
                data: kva_kw_data.map((value) => value.peakmax),
                type: 'line',
                yAxis: 1
            },
            {
                name: 'Wheeled In Solar (kW)',
                data:kva_kw_data.map((value) => value.wheeledmax),
                type: 'line',
                yAxis: 0
            },
            {
                name: 'RoofTop Phase 1 (kW)',
                data:kva_kw_data.map((value) => value.rooftopphase1),
                type: 'line',
                yAxis: 0,
                color:"red"
            },
            ]
    }
  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={KvaKwGraph} />
    </div>
  )
}

export default KvaVsKW
