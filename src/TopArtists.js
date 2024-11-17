// TopArtists.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TopCharts.css';

const TopArtists = () => {
  const [topArtists, setTopArtists] = useState([]);

  useEffect(() => {
    const fetchTopArtists = async () => {
      try {
        const response = await axios.get('http://localhost:5000/topcharts?category=artists');
        const artistsWithImages = await Promise.all(
          response.data.map(async (artist) => {
            const imageResponse = await axios.get(`http://localhost:5000/artist/image/${artist.artistid}`);
            return { 
              ...artist, 
              image: `data:image/jpg;base64,${imageResponse.data.image}` 
            };
          })
        );
        setTopArtists(artistsWithImages);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };

    fetchTopArtists();
  }, []);

  return (
    <div className="top-charts-list">
      {topArtists.map((artist, index) => (
        <Link to={`/artist/${artist.artistid}`} key={artist.artistid} className="chart-item">
          <div className="rank">{index + 1}</div>
          <img src={artist.image} alt={`${artist.fname} ${artist.lname}`} />
          <div className="info">
            <h3>{artist.fname} {artist.lname}</h3>
            <p>Average Rating: {parseFloat(artist.avg_rating).toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopArtists;
