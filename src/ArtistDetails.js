import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // Import useParams hook for accessing route parameters
import axios from 'axios';
import './ArtistDetails.css';

const ArtistDetails = () => {
  const { id } = useParams();  // Get the artist ID from the URL params
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        // Fetch artist details using the artist ID from the URL
        const response = await axios.get(`http://localhost:5000/artist/${id}`);
        setArtist(response.data);  // Set the fetched artist data in state
      } catch (error) {
        setError('Error fetching artist details.');  // Handle errors
        console.error('Error fetching artist details:', error);
      }
    };

    fetchArtistDetails();
  }, [id]);  // Re-fetch if the artist ID changes

  // If artist data is still being loaded
  if (!artist && !error) return <p>Loading...</p>;

  // If there's an error fetching artist data
  if (error) return <p>{error}</p>;

  return (
    <div className="artist-details-container">
      <div className="artist-details-flex">
        <div className="artist-info">
          <h2>{artist.fname} {artist.lname}</h2>
          <p><strong>Date of Birth:</strong> {new Date(artist.dob).toLocaleDateString()}</p>
          <p><strong>About:</strong> {artist.about}</p>
          <h3>Albums:</h3>
          {artist.albums && artist.albums.length > 0 ? (
            <p>{artist.albums.map(album => album.name).join(', ')}</p>
          ) : (
            <p>No albums available.</p>
          )}
        </div>
  
        <div className="artist-image">
          {artist.image ? (
            <img src={`data:image/jpg;base64,${artist.image}`} alt={`${artist.fname} ${artist.lname}`} />
          ) : (
            <p>No image available for this artist.</p>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default ArtistDetails;
