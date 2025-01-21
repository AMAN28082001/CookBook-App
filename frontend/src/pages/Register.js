// frontend/src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dummyRegister } from '../services/dummyData';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    try {
      dummyRegister(email, password);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
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
        onClick={handleRegister}
        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-500"
      >
        Register
      </button>
    </div>
  );
}

export default Register;
