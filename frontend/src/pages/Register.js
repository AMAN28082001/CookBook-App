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
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Sign Up</button>
    </div>
  );
}

export default Register;
