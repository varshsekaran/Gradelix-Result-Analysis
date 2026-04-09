import React, { useEffect, useState } from 'react';
import './SideBar.css';
import { Outlet, useNavigate } from 'react-router-dom';
import profilePic from '../assets/profile2.png';
//import axios from 'axios';

function Sidebar() {
  const navigate = useNavigate();
  const handleLoadSaved = (analysis) => {
    navigate('/analysis', { state: analysis });
  };

  return (
    <div className="app-container">

      <div className="sidebar">
        <div
          className="profile-logo"
          style={{
            backgroundImage: `url(${profilePic})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>

        <div className="profile-info">
          <div className="name">Dr.L.Lakshmanan - CSE</div>
          <div className="degree">M.E., Ph.D</div>
          <div className="role">Dean</div>
        </div>

        <button className="sidebar-btn" onClick={() => navigate('/hod?mode=cae')}>CAE</button>
        <button className="sidebar-btn" onClick={() => navigate('/hod?mode=semester')}>SEMESTER</button>

       <button className="sidebar-btn" onClick={() => navigate('/saved-cae')}>SAVED CAE</button>


        <button className="sidebar-btn" onClick={() => navigate('/saved-sem')}>SAVE SEMESTER</button>
        <button className="sidebar-btn" onClick={() => navigate('/staff-analysis')}>STAFF ANALYSIS</button>

         {/* NEW BUTTON */}
        <button className="sidebar-btn" onClick={() => navigate('/saved-staff')}>
          SAVED STAFF ANALYSIS
        </button>

      </div>

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default Sidebar;
