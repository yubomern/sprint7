import React, { useState } from "react";
import "./AppIns.css";
import {useSelector} from "react-redux"; // Import CSS

export default function AddReviewForm({ instructorId }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const { token } = useSelector((state) => state.auth)

    const handleSubmit = async e => {
        e.preventDefault();


        let id = instructorId.toString().trim();
        const res = await fetch(`http://localhost:4000/api/instructors/${id}/review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({  rating, comment })
        });
        const data = await res.json();
        console.table(data);
        window.location.reload();
    };

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            <h3 className="review-title">Add Review</h3>


            <label>Rating</label>
            <select
                className="review-select"
                value={rating}
                onChange={e => setRating(e.target.value)}
            >
                {[1,2,3,4,5].map(n => (
                    <option key={n} value={n}>{n}</option>
                ))}
            </select>

            <label>Comment</label>
            <textarea
                className="review-textarea"
                placeholder="Write your comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
            />

            <button className="review-button" type="submit">Submit</button>
        </form>
    );
}
