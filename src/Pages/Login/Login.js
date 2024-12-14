import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../config';

function LoginPage({ setRole }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.baseURL}/api/login`, { username, password });
      if (response.status === 200) {
        setRole(response.data.role);
        localStorage.setItem('isLogin', '1');
        localStorage.setItem('token', response.data.access_token);
        localStorage.setItem('role', response.data.role);
        navigate("/costestimation")
      } else {
        // Login failed
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
};

  return (
    <div>
      <div className='d-flex justify-content-center align-items-center' style={{height:"50vh"}}>
        <form style={{maxWidth:"250px"}} onSubmit={handleSubmit}>
          <h3>Sign In</h3>
          <div className="mb-3">
            <label>User Name</label>
            <input
              className="form-control"
              placeholder="Username"
              value={username} onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password} onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
      
    </div>
  );
}

export default LoginPage;