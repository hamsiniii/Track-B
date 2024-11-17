import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import './TopCharts.css';
import TopArtists from './TopArtists.js';
import TopAlbums from './TopAlbums.js';
import TopSongs from './TopSongs.js';

const TopCharts = () => {
  return (
    <div className="top-charts-container">
      <h2>Top Charts</h2>
      <div className="category-tabs"> <gra>
        <Link to="/top-charts/artists" className="tab-link">  Top Artists </Link>
        <Link to="/top-charts/albums" className="tab-link"> Top Albums </Link>
        <Link to="/top-charts/songs" className="tab-link">  Top Songs </Link>
        </gra>
      </div>

      <div className="top-charts-content">
        <Routes>
          <Route path="artists" element={<TopArtists />} />
          <Route path="albums" element={<TopAlbums />} />
          <Route path="songs" element={<TopSongs />} />
        </Routes>
      </div>
    </div>
  );
};

export default TopCharts;