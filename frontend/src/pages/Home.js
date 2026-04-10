import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();   // <-- NEW

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isRegister
      ? 'https://gradelix-backend.onrender.com/api/auth/register'
      : 'https://gradelix-backend.onrender.com/api/auth/login';

    try {
      const res = await axios.post(url, { email, password });
      alert(res.data.msg || 'Success');

      if (isRegister) {
        // after successful registration, flip to login mode & clear fields
        setIsRegister(false);
        setPassword('');
        return;
      }

      // login success: store token & go to dashboard
      localStorage.setItem('token', res.data.token);
      navigate('/hod');
    } catch (err) {
      alert(err?.response?.data?.msg || 'Something went wrong');
    }
  };

  return (
    <div className="home-wrapper">
      <div className="container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isRegister ? 'Register' : 'Login'}</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span style={{ color: 'blue', cursor: 'pointer' }}
                onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
      </form>
      </div>
    </div>
  );
}

export default Home;
