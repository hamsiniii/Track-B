import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "./App.css";
import Login from './Login.js';
import Signup from './Signup.js';
import FindSong from "./FindSong.js";
import Review from "./Review.js";
import ArtistDetails from "./ArtistDetails.js";
import MyReviews from "./MyReviews.js";
import TopCharts from "./TopCharts.js";
import Admin from "./Admin.js"; 
import GameBoard from "./GameBoard.js";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    alert('Logged out successfully!');
  };

  return (
    <Router>
      <div className="App">
        <NavBar user={user} setUser={setUser} handleLogout={handleLogout} />
        <Routes>
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
          <Route path="/top-charts/*" element={<TopCharts />} />
          <Route path="/memgame" element={<GameBoard/>}/>
          <Route path="/artist/:id" element={<ArtistDetails />} />
          <Route path="/findsong" element={<FindSong />} />
          <Route path="/reviews/:type/:id" element={<Review user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/my-reviews" element={<MyReviews userid={user?.id} />} />
          {user?.role === "admin" && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>
    </Router>
  );
}

const NavBar = ({ user, handleLogout }) => {
  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/top-charts/artists">Top Charts</Link></li>
        <li><Link to="/findsong">Search</Link></li>
        <li><Link to="/my-reviews">My Reviews</Link></li>
        <li><Link to="/memgame">Memory Game</Link></li>
        {user?.role === "admin" && <li><Link to="/admin">Admin</Link></li>}
      </ul>
      <div className="auth-buttons">
        {user ? (
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
          <Link to="/login"><button className="login-btn">Login</button></Link>
        )}
      </div>
    </nav>
  );
};

export default App;
