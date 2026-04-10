import React from 'react'
import './Navbar.css'
import logo from "../assets/Logo.jpeg"; 

const handleLogout = () => {
  localStorage.removeItem('token');
  navigate('/', { replace: true });
};

const Navbar =  ({ setShowLogin }) => {
  return (
    <div className="auth-container1">
          {/* Logo Image at the top */}
          <img src={logo} alt="Logo" className="logo" onClick={handleLogout} />
  
        <div className='navbar'>

            
        </div>
      </div>
  );
};

export default Navbar