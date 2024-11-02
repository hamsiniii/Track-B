import React, { useState } from 'react';
import axios from 'axios';
import './FindSong.css';
import { Link } from 'react-router-dom';

const FindSong = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      setResults(response.data); // Populate results with data from the backend
      setError('');
    } catch (err) {
      setError('Error fetching search results.');
      console.error(err);
    }
  };

  return (
    <div className="find-song-container">
      <h2>Find Your Song</h2>
      <form onSubmit={handleSearch} className="find-song-form">
        <input
          type="text"
          placeholder="Search for a song, album, or artist..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="results-container">
        {results.map((item) => (
          <Link
            key={item.id} // Make sure this is the correct id from your database
            to={`/reviews/${item.type}/${item.id}`} // Ensure type and id are passed correctly
            className="result-item"
          >
            {item.coverart && (
              <img src={item.coverart} alt={item.name} className="album-cover" />
            )}
            <div>
              <h4>{item.name}</h4>
              <p>Type: {item.type}</p>
              {item.date && <p>Date: {new Date(item.date).toLocaleDateString()}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FindSong;
