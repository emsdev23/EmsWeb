import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import React, { useState } from 'react';
import IITMRP from '../images/iitmlogo.png'

const Nav = styled.div`
  background: white;
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
  justify-content: center;
  align-items: center;
  margin-left: auto; /* Align to the right end */
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


 //moving side bar to right
// const SidebarNav = styled.nav`
//   background: #15171c;
//   width: 250px;
//   height: 100vh;
//   display: flex;
//   justify-content: center;
//   position: fixed;
//   top: 0;
//   right: ${({ sidebar }) => (sidebar ? '0' : '-100%')}; /* set right to 0 */
//   transition: 350ms;
//   z-index: 10;
// `;

// const SidebarWrap = styled.div`
//   width: 100%;
//   margin-right: 0; /* remove the margin-right */
// `;

function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <IconContext.Provider value={{ color: '#fff' }}>
  <Nav class="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: "100px" }}>
  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start",  flexGrow: 1 }}>
    <img src={IITMRP} alt='iitmrp' style={{ width: "120px", height: "110px" }} />
    <h1 style={{ textAlign: "center", color: "black", flexGrow: 1 }}><b>IITMRP Energy Management System</b></h1>
  </div>
  <NavIcon to='#'>
    <FaIcons.FaBars onClick={showSidebar} color='green' />
  </NavIcon>
</Nav>
      <SidebarNav sidebar={sidebar}  style={{background:"green"}}>
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
  )
}

export default Navbar;