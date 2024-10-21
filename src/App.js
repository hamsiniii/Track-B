import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"; // Correct imports for Routes and Link
import "./App.css";
import Login from './Login.js'; // Import Login component
import Signup from './Signup.js'; // Import Signup component

function App() {
  const [user, setUser] = useState(null); // State to hold the user info

  return (
    <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} /> {/* Pass user and setUser to NavBar */}
        <Routes>
          {/* Define the Home route */}
          <Route
            path="/"
            element={
              <div className="home-container">
                <h1 className="home-title">Welcome to Track B!</h1>
                <p className="home-description">
                  Discover top charts, find your favorite songs, and share your reviews and ratings on the ultimate music platform.
                </p>
              </div>
            }
          />
          {/* Define Login and Signup routes */}
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

const NavBar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null); // Clear user state on logout
    alert('Logged out successfully!'); // You can redirect or show a toast message here
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/top-charts">Top Charts</Link></li>
        <li><Link to="/find-song">Find a Song</Link></li>
        <li><Link to="/my-reviews">My Reviews</Link></li>
      </ul>
      <div className="auth-buttons">
        {user ? ( // If user is logged in, show their name
          <div className="user-container">
            <button 
              className="login-btn" 
              onClick={handleLogout} 
              onMouseEnter={e => e.currentTarget.textContent = "Logout"}
              onMouseLeave={e => e.currentTarget.textContent = user.name + "!"}
            >
              {user.name}
            </button>
          </div>
        ) : (
          <Link to="/login"><button className="login-btn">Login</button></Link> // Link to login page
        )}
      </div>
    </nav>
  );
};

export default App;
