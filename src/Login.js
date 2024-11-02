import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; 
import "./login.css"; 

function Login({ setUser }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Login successful!');
      const userData = { id: data.user.id, name: data.user.name, email: data.user.email };
      
      // Set user state and save to localStorage
      setUser(userData); 
      localStorage.setItem("user", JSON.stringify(userData)); // Save user data in localStorage

      navigate('/'); 
    } else {
      alert(`Error: ${data.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-btn">Login</button>
      </form>
      <p>
        Not registered? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
}

export default Login;
