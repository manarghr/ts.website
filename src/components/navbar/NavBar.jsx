import React from 'react';
import "./Navbar.css";
import { FaRegBell } from "react-icons/fa6";


import { FaSearch } from "react-icons/fa";


import { FaRegUserCircle } from "react-icons/fa";


function Navbar() {
    
    return (
        <div className='head'>
            <div className="left">
                <p>TrainSight</p>
          
               
                <ul className="nav">
                    <li>Home</li>
                   <li>
                       Services 
                       </li>

                    <li>Blog</li>
                    <li>Help Center</li>
                    <li>About us</li>
                </ul>
            </div>

            <div className="right">
              
             <FaSearch  className='icons'/>
             <FaRegBell className='icons'/>
             <FaRegUserCircle className='icons'/>

             
            </div>
        </div>
    );
}

export default Navbar;
