import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // To redirect after login
import "./login.css"; // Ensure you have the appropriate CSS

function Login({ setUser }) { // Accept setUser as a prop to store the logged-in user's info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Send email and password to the backend
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // If login is successful, store the user info (could be stored in state or localStorage)
      alert('Login successful!');
      setUser(data.user); // Set the logged-in user's data
      navigate('/'); // Redirect to home or a different page
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
