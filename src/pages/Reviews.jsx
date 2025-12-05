// src/pages/Reviews.jsx
import React from "react";
import "./Reviews.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const reviewsData = [
  {
    id: 1,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.0,
  },
  {
    id: 3,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.0,
  },
  {
    id: 4,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.0,
  },
  {
    id: 5,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.0,
  },
  {
    id: 6,
    name: "Chaitanya Thota",
    location: "Hyderabad",
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    review:
      "Hlo PG made finding my perfect PG Hostel so easy! The verified listings gave me peace of mind, and the whole process was smooth from start to finish.",
    rating: 4.0,
  },
];

// ⭐ Render Star Ratings
const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={i} color="#FFD700" />);
  if (hasHalfStar) stars.push(<FaStarHalfAlt key="half" color="#FFD700" />);
  while (stars.length < 5) stars.push(<FaRegStar key={`empty-${stars.length}`} color="#FFD700" />);

  return <div className="stars">{stars}</div>;
};

const Reviews = () => {
  return (
    <div className="reviews-container">
      <h2 className="reviews-title">Customer Reviews</h2>
      <div className="reviews-grid">
        {reviewsData.map((review) => (
          <div key={review.id} className="review-card">
            <div className="review-header">
              <img src={review.avatar} alt={review.name} className="avatar" />
              <div className="reviewer-info">
                <h4>{review.name}</h4>
                <p>{review.location}</p>
              </div>
            </div>
            <p className="review-text">{review.review}</p>
            {renderStars(review.rating)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
