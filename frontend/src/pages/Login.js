// frontend/src/pages/Login.js
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
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      navigate('/');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <div className="mb-2">
        <input
          type="text"
          placeholder="Email"
          className="border rounded px-2 py-1 w-64"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-2">
        <input
          type="password"
          placeholder="Password"
          className="border rounded px-2 py-1 w-64"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
      >
        Login
      </button>
    </div>
  );
}

export default Login;
