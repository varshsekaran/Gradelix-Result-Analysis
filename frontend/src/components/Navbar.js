import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from "../assets/Logo.jpeg";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-container1">
      <img src={logo} alt="Logo" className="logo" onClick={handleLogout} />

      <div className='navbar'>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;