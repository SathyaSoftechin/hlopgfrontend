// src/pages/Reviews.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./Reviews.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/* ⭐ Render Star Ratings */
const renderStars = (rating = 0) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<FaStar key={`full-${i}`} color="#FFD700" />);
  }

  if (hasHalfStar) {
    stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
  }

  while (stars.length < 5) {
    stars.push(
      <FaRegStar key={`empty-${stars.length}`} color="#FFD700" />
    );
  }

  return <div className="stars">{stars}</div>;
};

const Reviews = () => {
  const token = localStorage.getItem("hlopgToken");

  const [reviews, setReviews] = useState(null); // 🔑 null = not fetched
  const [loading, setLoading] = useState(true);

  /* ================= FETCH REVIEWS ================= */
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get("/reviews/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReviews(res.data?.data || []);
      } catch (err) {
        console.warn("Reviews API not ready yet");
        setReviews(null); // 🔑 keep UI alive
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [token]);

  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Customer Reviews</h2>

      {/* Loading State */}
      {loading && <p>Loading reviews…</p>}

      {/* API Not Ready */}
      {!loading && reviews === null && (
        <p>Data needs to be fetched</p>
      )}

      {/* No Reviews */}
      {!loading && reviews?.length === 0 && (
        <p>No reviews available</p>
      )}

      {/* Reviews Grid */}
      {!loading && reviews?.length > 0 && (
        <div className="reviews-grid">
          {reviews.map((r) => (
            <div key={r.review_id} className="review-card">
              <div className="review-header">
                <img
                  src={
                    r.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt={r.name || "User"}
                  className="avatar"
                />
                <div className="reviewer-info">
                  <h4>{r.name || "Anonymous"}</h4>
                  <p>{r.location || "-"}</p>
                </div>
              </div>

              <p className="review-text">{r.comment || "-"}</p>
              {renderStars(r.rating)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
