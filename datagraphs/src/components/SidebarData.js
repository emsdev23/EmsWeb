import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as GoIcons from 'react-icons/go';
import BatteryAlertIcon from '@mui/icons-material/BatteryAlert';
import SevereColdIcon from '@mui/icons-material/SevereCold';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ThermostatAutoIcon from '@mui/icons-material/ThermostatAuto';
import * as SiIcons from 'react-icons/si'
import * as GiIcons from  'react-icons/gi'
import * as TbIcons from  'react-icons/tb'

//import * as FaIcons from 'react-icons/fa'



//FaIcons.FaCarBattery

export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
    
  },
  {
    title: 'Analytics',
    // path: '/Analytics',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text',
    subNav: [
      {
        title: 'Building consumption',
        path: '/peakgraph',
        icon: <SiIcons.SiGoogleanalytics />
      },
      {
        title: 'Wheeled In Solar',
        path: '/Wheeledgraph',
        icon: <GiIcons.GiSolarPower />
      },
      {
        title: 'RoofTop Solar',
        path: '/RoofTopSolar',
        icon: <TbIcons.TbSolarPanel2 />
      },
      {
        title: 'UPS Battery',
        path: '/Battery_Analytics',
        icon: <TbIcons.TbBatteryAutomotive />
      },
      {
        title: 'Chillers ',
        path: '/chillersDashboard',
        icon: <SevereColdIcon />
      },
      
    ]
  },{
    title: 'Alerts',
    //path: '/Alertlogs',
    icon: <GoIcons.GoAlert />,
    cName: 'nav-text',
    subNav:[
      {
        title: 'Alert Logs',
        path: '/Alertlogs',
        icon: <GoIcons.GoAlert />,
        cName: 'nav-text'
      },
      {
        title: 'Building consumption',
        path: '/Alerts/Peakdemand',
        icon: <BatteryAlertIcon />,
      },
      {
        title: 'Chillers',
        path: '/Alerts/ChillerAlerts',
        icon: <SevereColdIcon />
      },
      {
        title: 'Thermal',
        path: '/Alerts/Thermalalers',
        icon: <ThermostatIcon />
      }
      
    ],
    
  },
  // {
  //   title: 'Active Alerts',
  //   // path: '/Alerts',
  //   icon: <GoIcons.GoAlert />,
  //   cName: 'nav-text',
  //   subNav: [
  //     {
  //       title: 'Building consumption',
  //       path: '/Alerts/Peakdemand',
  //       icon: <BatteryAlertIcon />
  //     },
  //     {
  //       title: 'Chillers',
  //       path: '/Alerts/ChillerAlerts',
  //       icon: <SevereColdIcon />
  //     },
  //     {
  //       title: 'Thermal',
  //       path: '/Alerts/Thermalalerts',
  //       icon: <ThermostatIcon />
  //     }
  //   ]
  // }
  

  
  {
    title: 'Controls',
    // path: '/Control',
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text',
    subNav: [
      {
        title: 'Battery control',
        path: '/Control/upsbattery',
        icon: <BatteryChargingFullIcon />
      },
      {
        title: 'Thermal control',
        path: '/Control/thermal',
        icon: <ThermostatAutoIcon />
      },
     
    ]
  },
  {
    title: 'Documentation',
    path: '/Documentation',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];