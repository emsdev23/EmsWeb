import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as GoIcons from 'react-icons/go';


export const SidebarData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
    
  },
  {
    title: 'Analytics',
    path: '/Analytics',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  {
    title: 'Alerts',
    path: '/Alerts',
    icon: <GoIcons.GoAlert />,
    cName: 'nav-text'
  },
  {
    title: 'Control',
    path: '/Control',
    icon: <FaIcons.FaEnvelopeOpenText />,
    cName: 'nav-text'
  },
  {
    title: 'Documentation',
    path: '/Documentation',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];