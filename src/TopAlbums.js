// TopAlbums.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './TopCharts.css';

const TopAlbums = () => {
  const [topAlbums, setTopAlbums] = useState([]);

  useEffect(() => {
    const fetchTopAlbums = async () => {
      try {
        const response = await axios.get('http://localhost:5000/topcharts?category=albums');
        setTopAlbums(response.data);
      } catch (error) {
        console.error('Error fetching top albums:', error);
      }
    };

    fetchTopAlbums();
  }, []);

  return (
    <div className="top-charts-list">
      {topAlbums.map((album, index) => (
        <Link to={`/reviews/album/${album.albumid}`} key={album.albumid} className="chart-item">
          <div className="rank">{index + 1}</div>
          <img src={album.coverart} alt={album.name} />
          <div className="info">
            <h3>{album.name}</h3>
            <p>Average Rating: {parseFloat(album.avg_rating).toFixed(2)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TopAlbums;
