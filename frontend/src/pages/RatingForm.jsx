import React, { useState } from 'react';
import axios from 'axios';
import './Rating.css'
import {useSelector} from "react-redux";
const RatingForm = ({ courseId,userId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const {token}  =useSelector((state) => state.auth);

    let BASE_URL = 'http://localhost:4000';
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating < 1) {
            setMessage("Please select a rating.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await axios.post(
              BASE_URL +   '/api/ratings/rate',
                {
                    courseId,
                    rating,
                    review,
                    userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // assuming JWT
                        'Content-Type': 'application/json'
                    }
                }
            );

            setMessage('Review submitted successfully!');
            setRating(0);
            setReview('');
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'Error submitting review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rating-form"  style={{background:'grey'}}>
            <h3>Leave a Rating & Review</h3>
            <form onSubmit={handleSubmit}>
                <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            style={{
                                fontSize: '24px',
                                color: star <= rating ? '#FFD700' : '#ccc',
                                cursor: 'pointer'
                            }}
                            onClick={() => setRating(star)}
                        >
              ★
            </span>
                    ))}
                </div>

                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    style={{background:"#5544ee"}}
                    placeholder="Write your review here..."
                    rows={4}
                    required
                />

                <button type="submit" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
};

export default RatingForm;
