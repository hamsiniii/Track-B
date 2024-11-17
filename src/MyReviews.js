import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyReviews.css';

const MyReviews = ({ userid }) => {
    const [reviews, setReviews] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [editedComment, setEditedComment] = useState('');
    const [editedRating, setEditedRating] = useState(0);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/reviews/user/${userid}`);
                setReviews(response.data.reviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        if (userid) {
            fetchReviews();
        }
    }, [userid]);

    const handleDeleteReview = async (reviewId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this review?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/reviews/${reviewId}`);
            setReviews(reviews.filter((review) => review.reviewid !== reviewId));
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const handleEditReview = (review) => {
        setEditMode(review.reviewid);
        setEditedComment(review.comment);
        setEditedRating(review.rating);
    };

    const handleConfirmEdit = async (reviewId) => {
        try {
            await axios.put(`http://localhost:5000/review/${reviewId}`, {
                comment: editedComment,
                rating: editedRating,
            });
            setReviews(reviews.map((review) =>
                review.reviewid === reviewId ? { ...review, comment: editedComment, rating: editedRating } : review
            ));
            setEditMode(null);
        } catch (error) {
            console.error('Error updating review:', error);
        }
    };

    return (
        <div className="review-container">
            <h2>My Reviews</h2>
            {reviews.length > 0 ? (
                <ul className="reviews-list">
                    {reviews.map((review) => (
                        <li key={review.reviewid} className="review-item">
                            <div className="review-header">
                                <strong>{review.albumName || review.songName}</strong>
                                <span>({new Date(review.date).toLocaleDateString()})</span>
                            </div>
                            <div className="review-rating rating">
                                {editMode === review.reviewid ? (
                                    Array.from({ length: 5 }, (_, i) => (
                                        <span
                                            key={i}
                                            className={`star ${i < editedRating ? 'filled' : ''}`}
                                            onClick={() => setEditedRating(i + 1)}
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
                                <textarea
                                    value={editedComment}
                                    onChange={(e) => setEditedComment(e.target.value)}
                                    className="edit-comment"
                                />
                            ) : (
                                <p>{review.comment}</p>
                            )}
                            <br></br>
                            {editMode === review.reviewid ? (
                                <button onClick={() => handleConfirmEdit(review.reviewid)} className="confirm-edit">
                                    Confirm
                                </button>
                            ) : (
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
            ) : (
                <p>Not logged in/ No reviews yet.</p>
            )}
        </div>
    );
};

export default MyReviews;
