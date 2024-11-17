// TopSongs.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TopCharts.css';

const TopSongs = () => {
  const [topSongs, setTopSongs] = useState([]);

  useEffect(() => {
    const fetchTopSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/topcharts?category=songs');
        setTopSongs(response.data);
      } catch (error) {
        console.error('Error fetching top songs:', error);
      }
    };

    fetchTopSongs();
  }, []);

  return (
    <div className="top-charts-list">
      {topSongs.map((song, index) => (
        <Link to={`/reviews/song/${song.songid}`} key={song.songid} className="chart-item">
          <div className="rank">{index + 1}</div>
          <img src={song.coverart} alt={song.name} />
          <div className="info">
            <h3>{song.name}</h3>
            <p>Average Rating: {parseFloat(song.avg_rating).toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopSongs;
