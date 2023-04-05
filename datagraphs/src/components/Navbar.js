import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navebar.css';
import { IconContext } from 'react-icons';
import { width } from '@mui/system';

function Navbar() {
    const [sidebar, setSidebar] = useState(false);

    const showSidebar = () => setSidebar(!sidebar);
  return (
    <>
    {/* <IconContext.Provider value={{ color: '#fff' }}>
        <div className='navbar'>
          <Link to='#' className='menu-bars'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider> */}
      {/* <button class="btn btn-primary  " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling" style={{width:'100%',textAlign:'left',height:"60px"}}> <FaIcons.FaBars size={40} style={{color:'black'}}/> </button> */}
      <nav class=" navbar bg-success text-white" style={{height:"100px",width:"100%"}}>
  <div class="container-fluid">
    <button class="btn btn-dark  " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling" > <FaIcons.FaBars size={40} style={{color:"white"}}/> </button> 
    <h3 style={{color:"white",marginRight:"460px",justifyContent:"center"}}><img src='https://respark.iitm.ac.in/wp-content/uploads/2019/07/iitm-logo-cirle.png' alt='iitmrp' style={{width:"fit-contenet",height:"90px",justifyContent:'center'}}/><b>IITMRP Energy Management System</b></h3>
  </div>
</nav>
      {/* <IconContext.Provider value={{ color: '#fff' }}></IconContext.Provider> */}

<div class="offcanvas offcanvas-start show text-bg-dark" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel" >
  <div class="offcanvas-header">
    {/* <h5 class="offcanvas-title" id="offcanvasScrollingLabel">Offcanvas with body scrolling</h5> */}
    <button type="button" class="btn-close  " data-bs-dismiss="offcanvas" aria-label="Close" style={{color:"wheat"}} ><AiIcons.AiOutlineClose size={40} style={{color:"white" }}/></button>
  </div>
  <div class="offcanvas-body">
  <ul className='nav-menu-items' >
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
  </div>
  
</div>
      
    </>
  )
}

export default Navbar
