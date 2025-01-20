import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyLogin } from '../services/dummyData';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    try {
      const { userId, token } = dummyLogin(email, password);
      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <div className="input-group">
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Submit</button>
    </div>
  );
}

export default Login;
