import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './Review.css';


const Review = ({ user }) => {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [songs, setSongs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(0);
    const [editMode, setEditMode] = useState(null);
    const [editedReview, setEditedReview] = useState('');
    const [editedRating, setEditedRating] = useState(0);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/details/${type}/${id}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Error fetching details:', error);
            }
        };

        const fetchSongs = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/details/album/${id}/songs`);
                setSongs(response.data);
            } catch (error) {
                console.error('Error fetching songs:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/reviews/${type}/${id}`);
                setReviews(response.data);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchDetails();
        fetchReviews();

        if (type === 'album') {
            fetchSongs();
        }
    }, [type, id]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to submit a review.");
            navigate('/login');
            return;
        }

        if (!rating) {
            alert("Please provide a rating.");
            return;
        }

        try {
            await axios.post(`http://localhost:5000/reviews`, {
                type,
                id,
                review: newReview,
                rating,
                userid: user.id,
            });
            setNewReview('');
            setRating(0);
            const updatedReviews = await axios.get(`http://localhost:5000/reviews/${type}/${id}`);
            setReviews(updatedReviews.data);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this review?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
            const updatedReviews = await axios.get(`http://localhost:5000/reviews/${type}/${id}`);
            setReviews(updatedReviews.data);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleEditReview = (review) => {
        setEditMode(review.reviewid);
        setEditedReview(review.review);
        setEditedRating(review.rating);
    };

    const handleConfirmEdit = async (reviewId) => {
        try {
            await axios.put(`http://localhost:5000/review/${reviewId}`, {
                comment: editedReview,
                rating: editedRating,
            });
            setReviews(reviews.map((review) =>
                review.reviewid === reviewId ? { ...review, review: editedReview, rating: editedRating } : review
            ));
            setEditMode(null);  // Exit edit mode
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    const handleRatingChange = (index) => {
        setRating(index);
    };

    const handleEditRatingChange = (index) => {
        setEditedRating(index);
    };

    if (!details) return <div>Loading...</div>;

    const formattedReleaseDate = details.releasedate ? new Date(details.releasedate).toLocaleDateString() : '-';

    return (
        <div className="review-container">
            <h2>{details.name}</h2>
            <div className="details-section">
                <div className="info">
                    <p><strong>Release Date:</strong> {formattedReleaseDate}</p>
                    {type === 'album' && (
                        <>
                            <p><strong>Number of Songs:</strong> {details.song_count || '-'}</p>
                            <p><strong>Songs: </strong>
                                {songs.length > 0
                                    ? songs.map((song) => song.name).join(', ')
                                    : 'No songs available'}
                            </p>
                        </>
                    )}
                    {type === 'song' && (
                        <p><strong>Album:</strong> {details.album_name || '-'}</p>
                    )}
                    <p>
                        <strong>Ratings: </strong>
                        {details.average_rating != null && !isNaN(Number(details.average_rating))
                            ? Number(details.average_rating).toFixed(2)
                            : '-'}
                    </p>
                </div>
                <img src={details.coverart} alt={details.name} className="cover-art" />
            </div>

            <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="rating">
                    <p><strong>Your Rating:</strong></p>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleRatingChange(star)}
                            className={star <= rating ? "star filled" : "star"}
                        >
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review here"
                    required
                    className="review-input"
                />
                <button type="submit" className="submit-review">Submit Review</button>
            </form>

            <h3>Reviews</h3>
            <ul className="reviews-list">
                {reviews.map((review) => (
                    <li key={review.reviewid} className="review-item">
                        <div className="review-header">
                            <strong>{review.username}</strong>
                            <span className="review-header">
                                {review.user_role === 'critic' && (
                                    <span className="badge">
                                        <img src="https://www.freeiconspng.com/uploads/silver-medal-icon-blank-44.png" alt="Critic Badge" className="critic-icon" />
                                    </span>
                                )}
                                ({new Date(review.date).toLocaleDateString()})
                            </span>
                        </div>
                        <div className="review-rating">
                            {editMode === review.reviewid ? (
                                 Array.from({ length: 5 }, (_, i) => (
                                    <span
                                        key={i}
                                        className={`star ${i < editedRating ? 'filled' : ''}`}
                                        onClick={() => handleEditRatingChange(i + 1)} 
                                    >
                                        ★
                                    </span>
                                ))
                            ) : (
                                Array.from({ length: review.rating }, (_, i) => (
                                    <span key={i} className="star">★</span>
                                ))
                            )}
                        </div>
                        {editMode === review.reviewid ? (
                            <>
                                <textarea
                                    value={editedReview}
                                    onChange={(e) => setEditedReview(e.target.value)}
                                    className="edit-review-input"
                                />
                                <br></br>
                                <button onClick={() => handleConfirmEdit(review.reviewid)} className="confirm-edit">
                                    Confirm
                                </button>
                            </>
                        ) : (
                            <p>{review.review}</p>
                        )}
                        {user && user.id === review.userid && ( 
                            <>
                                <button onClick={() => handleEditReview(review)} className="edit-review">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteReview(review.reviewid)} className="delete-review">
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Review;
