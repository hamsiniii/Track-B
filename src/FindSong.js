import React, { useState } from 'react';
import axios from 'axios';
import './FindSong.css';
import { Link } from 'react-router-dom';

const FindSong = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const fetchArtistImage = async (artistId) => {
    try {
      const response = await axios.get(`http://localhost:5000/artist/image/${artistId}`);
      return response.data.image ? `data:image/jpg;base64,${response.data.image}` : null;
    } catch (err) {
      console.error('Error fetching artist image:', err);
      return null;
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/search?query=${query}`);
      const fetchedResults = response.data;

      const updatedResults = await Promise.all(
        fetchedResults.map(async (item) => {
          if (item.type === 'artist') {
            const image = await fetchArtistImage(item.id);
            return { ...item, coverart: image }; 
          }
          return item;
        })
      );

      setResults(updatedResults); 
      setError('');
    } catch (err) {
      setError('Error fetching search results.');
      console.error(err);
    }
  };

  return (
    <div className="find-song-container">
      <h2>Find Your Song/Artist/Album</h2>
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
          key={item.id}
          to={item.type === 'artist' ? `/artist/${item.id}` : `/reviews/${item.type}/${item.id}`}
          className="result-item"
        >
          {item.coverart && (
            <img src={item.coverart} alt={item.name} className="album-cover" />
          )}
          <div>
            <h4>{item.name}</h4>
            <p>Type: {item.type}</p>
            {item.date && <p>Date of Birth/Release: {new Date(item.date).toLocaleDateString()}</p>}
          </div>
        </Link>
        
        ))}
      </div>
    </div>
  );
};

export default FindSong;
