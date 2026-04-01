import React from 'react'
import "./Navbar.css";
// import navlogo from "../../assets/nav-logo.svg";
// import navProfile from '../../assets/nav-profile.svg';
// import navlogo from "/nav-logo.svg";
// import navProfile from "/nav-profile.svg";
const Navbar = () => {
  return (
    <div className='navbar'>
        <img src="/nav-logo.svg" alt="" className="nav-logo" />
        <img src="/nav-profile.svg" alt="" className='nav-profile'/>
    </div>
  )
}

export default Navbar