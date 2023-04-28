import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import React, { useState } from 'react';

const Nav = styled.div`
  background: #4BB543;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

// const Sidebar = () => {

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  
  return (
    <> 
     <IconContext.Provider value={{ color: '#fff' }}>
        <Nav class="row" style={{display: 'flex',alignitems: 'center',justifycontent: 'center',height:"100px"}}> 
          <NavIcon to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
           
          </NavIcon>
          <div  style={{display: "flex", alignItems: "center", justifyContent: "center"}}> 
          <img src='https://respark.iitm.ac.in/wp-content/uploads/2019/07/iitm-logo-cirle.png' alt='iitmrp' style={{width:"150px",height:"100px",marginLeft:"150px"}}/>
          <h1 style={{marginLeft: "20px", textAlign: "center",fontSize:"45px",color:"black"}}> <b>IITMRP Energy Management System</b></h1>
          </div>
          
        </Nav>
        <SidebarNav sidebar={sidebar}>
          <SidebarWrap>
            <NavIcon to='#'>
              <AiIcons.AiOutlineClose onClick={showSidebar} />
           
            </NavIcon>
            {SidebarData.map((item, index) => {
              return <SubMenu item={item} key={index} />;
            })}
          </SidebarWrap>
        </SidebarNav>
      </IconContext.Provider>
    </>
  
  )
}

export default Navbar












//       <nav class=" navbar bg-success text-white" style={{height:"100px",width:"100%"}}>
//   <div class="container-fluid">
//     <button class="btn btn-dark  " type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasScrolling" aria-controls="offcanvasScrolling" > <FaIcons.FaBars size={40} style={{color:"white"}}/> </button> 
//     <h3 style={{color:"white",marginRight:"460px",justifyContent:"center"}}><img src='https://respark.iitm.ac.in/wp-content/uploads/2019/07/iitm-logo-cirle.png' alt='iitmrp' style={{width:"fit-contenet",height:"90px",justifyContent:'center'}}/><b>IITMRP Energy Management System</b></h3>
//   </div>
// </nav>


// <div class="offcanvas offcanvas-start show text-bg-dark" data-bs-scroll="true" data-bs-backdrop="true" tabindex="-1" id="offcanvasScrolling" aria-labelledby="offcanvasScrollingLabel" >
//   <div class="offcanvas-header">
//     <button type="button" class="btn-close  " data-bs-dismiss="offcanvas" aria-label="Close" style={{color:"wheat"}} ><AiIcons.AiOutlineClose size={40} style={{color:"white" }}/></button>
//   </div>
//   <div class="offcanvas-body">
//   <ul className='nav-menu-items' >
//             {SidebarData.map((item, index) => {
//               return (
//                 <li key={index} className={item.cName}>
//                   <Link to={item.path}>
//                     {item.icon}
//                     <span>{item.title}</span>
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//   </div>
  
// </div>
