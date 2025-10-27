import React from 'react';
import "./Navbar.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { faChevronDown } from '@fortawesome/free-solid-svg-icons';


function Navbar() {
    
    return (
        <div className='head'>
            <div className="left">
                <p>TrainSight</p>
          
               
                <ul className="nav">
                    <li>Home</li>
                   <li>
                       Services <FontAwesomeIcon icon={faChevronDown} className="arrow-icon" />
                       </li>

                    <li>Blog</li>
                    <li>Help Center</li>
                    <li>About us</li>
                </ul>
            </div>

            <div className="right">
             <FontAwesomeIcon icon={faSearch} className="search-icon" />


             
            </div>
        </div>
    );
}

export default Navbar;
