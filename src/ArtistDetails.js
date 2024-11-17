import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ArtistDetails.css';

const ArtistDetails = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtistDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/artist/${id}`);
        setArtist(response.data);
        console.log("Artist details:", response.data); 
      } catch (error) {
        setError('Error fetching artist details.');
        console.error('Error fetching artist details:', error);
      }
    };

    fetchArtistDetails();
  }, [id]);

  if (!artist && !error) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="artist-details-container">
      <div className="artist-details-flex">
        <div className="artist-info">
          <h2>{artist.fname} {artist.lname}</h2>
          <h3><strong>Date of Birth:</strong> {new Date(artist.dob).toLocaleDateString()}</h3>
          <h3><strong>About:</strong> {artist.about}</h3>
          <h3><strong>Average Rating: </strong> 
          {artist.avgRating != null && !isNaN(Number(artist.avgRating))
            ? Number(artist.avgRating).toFixed(2)
            : '-'}</h3>
          <h3>Albums:</h3>
          {artist.albums.length > 0 ? (
            <p>{artist.albums.map(album => album.name).join(', ')}</p>
          ) : (
            <p>No albums available.</p>
          )}

          <h3>Songs:</h3>
          {artist.songs.length > 0 ? (
            <p>{artist.songs.map(song => song.name).join(', ')}</p>
          ) : (
            <p>No songs available.</p>
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

      <h3>Reviews:</h3>
      <br></br>
      <div className="reviews-list">
        {artist.reviews.length > 0 ? (
          artist.reviews.map((review, index) => (
            <div key={index} className="review-item">
              <h4>{review.name || "Unknown"} ({review.type})</h4> {/* Fallback to "Unknown" if name is missing */}
              <p><strong>Rating:</strong> {review.rating}</p>
              <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
              <p>{review.comment}</p>
            </div>
          ))
        ) : (
          <p>No reviews available.</p>
        )}
      </div>
    </div>
  );
};

export default ArtistDetails;
