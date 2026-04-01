import React from 'react'
import {Link} from "react-router-dom";
import "./Sidebar.css";
const Sidebar = () => {
  return (
    <div className='sidebar'>
<Link to ={"/addProduct"} style={{textDecoration:"none"}}>
<div className="sidebar-item">

    <img src="/Product_Cart.svg" alt="" />
    <p>Add Product</p>
</div>
</Link>
<Link to ={"/listproduct"} style={{textDecoration:"none"}}>
<div className="sidebar-item">

    <img src="/Product_list_icon.svg" alt="" />
    <p> Product List</p>
</div>
</Link>
    </div>
  )
}

export default Sidebar