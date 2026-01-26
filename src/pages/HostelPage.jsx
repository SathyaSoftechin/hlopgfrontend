// File: src/pages/HostelPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import "./HostelPage.css";
import {
  FaWifi,
  FaFan,
  FaBed,
  FaTv,
  FaLightbulb,
  FaDoorClosed,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaShower,
  FaLock,
  FaParking,
} from "react-icons/fa";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";
import Popup from "../components/Popup";
import api, { BASE_URL } from "../api";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const HostelPage = () => {
  const { hostelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [hostelData, setHostelData] = useState(null);
  const [foodMenu, setFoodMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(true);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [userId, setUserId] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  // Fetch hostel data
  useEffect(() => {
    const fetchHostel = async () => {
      try {
        const res = await api.get(`/hostel/${hostelId}`);
        setHostelData(res.data.data);
      } catch (err) {
        console.error("Error fetching hostel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHostel();
  }, [hostelId]);

  // Fetch reviews
  useEffect(() => {
    if (isPopupOpen) return;

    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${hostelId}`);
        if (res.data.ok) {
          setHostelData((prev) => ({
            ...prev,
            reviews: res.data.data.reviews,
            avgRating: res.data.data.avgRating,
            totalReviews: res.data.data.totalReviews,
          }));
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, [hostelId, isPopupOpen]);

  // Fetch food menu
  useEffect(() => {
    const fetchFoodMenu = async () => {
      try {
        const res = await api.get(`/food_menu/${hostelId}`);
        if (res.data.ok) {
          const { breakfast, lunch, dinner } = res.data.data;
          const days = Object.keys(breakfast || {}).map((day) => ({
            day,
            breakfast: breakfast[day] || "-",
            lunch: lunch[day] || "-",
            dinner: dinner[day] || "-",
          }));
          setFoodMenu(days);
        } else {
          setFoodMenu([]);
        }
      } catch (err) {
        console.error("Error fetching food menu:", err);
        setFoodMenu([]);
      } finally {
        setMenuLoading(false);
      }
    };
    fetchFoodMenu();
  }, [hostelId]);

  // Image carousel
  const images =
  hostelData?.images && hostelData.images.length > 0
    ? hostelData.images.map((img) =>
        img.startsWith("http") ? img : `${BASE_URL}${img}`
      )
    : [pg1, pg2, pg3, pg4, pg5];
  const prevImage = () =>
    setMainImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () =>
    setMainImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  // Continue Booking
  const handleContinue = async (data) => {
    try {
      if (!userId) {
        alert("User not authenticated");
        return;
      }
      const {
      sharing,
      priceType,
      numDays,
      date,
      rentAmount,
      deposit,
      totalAmount,
    } = data;

     if (
      !sharing ||
      !priceType ||
      !numDays ||
      !date ||
      !rentAmount ||
      totalAmount == null
    ) {
      alert("Please fill all booking details");
      return;
    }
const token = localStorage.getItem("hlopgToken");

     const payload = {
       hostelId,
      sharing,
      priceType,
      numDays,
      date,
      rentAmount,
      deposit,
      totalAmount,
    };

      const res = await api.post("/booking/newbooking", payload, {
          headers: { Authorization: `Bearer ${token}` }  }
 );

      if (res.data.success) {
        alert(`Booking Successful! Booking ID: ${res.data.bookingId}`);
        setIsPopupOpen(false);
        navigate("/MyBookings");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong while booking.");
    }
  };

  // Book Now Button
  const handleBookNow = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");
      const owner = localStorage.getItem("hlopgOwner");

      if (owner) {
        alert("You are logged in as Hostel Owner. Not authorized to book.");
        return;
      }

      if (!token) {
        alert("Please log in to continue booking.");
        navigate("/StudentLogin", { state: { from: location.pathname } });
        return;
      }

      const res = await api.get("/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setUserId(res.data.user.id || res.data.user.user_id);
        setIsPopupOpen(true);
      } else {
        alert("Not authorized. Please log in again.");
        localStorage.removeItem("hlopgToken");
        navigate("/StudentLogin");
      }
    } catch (err) {
      console.error("Auth verification failed:", err);
      alert("Session expired. Please log in again.");
      localStorage.removeItem("hlopgToken");
      navigate("/StudentLogin", { state: { from: location.pathname } });
    }
  };

  if (loading) return <div className="loading">Loading hostel details...</div>;
  if (!hostelData) return <div className="error">No hostel found.</div>;

  return (
    <div className="hostel-page">
      {/* Hostel UI */}
      <div className="hostel-main">
        {/* Left Images */}
        <div className="hostel-images">
          <div className="main-img">
            <button className="arrow-left" onClick={prevImage}>
              <FaChevronLeft />
            </button>
            <img src={images[mainImageIndex]} alt="Room" />
            <button className="arrow-right" onClick={nextImage}>
              <FaChevronRight />
            </button>
          </div>

          <div className="thumbnail-container">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={mainImageIndex === idx ? "active-thumb" : ""}
                onClick={() => setMainImageIndex(idx)}
              />
            ))}
          </div>
        </div>

        {/* Right Details */}
        <div className="hostel-details">
          <h2 className="black-text">{hostelData.hostel_name}</h2>
          <p className="black-text">{hostelData.address}</p>
          <p className="black-text">
            <b>Type of Living:</b> {hostelData.pg_type}'s PG
          </p>

          {/* Pricing */}
          <div className="stats">
            {Object.entries(hostelData.sharing || {}).map(
              ([sharing, price], idx) => (
                <div key={idx} className="stat-container">
                  <span className="stat-btn black-text">
                    {sharing} 👤 ₹{price}
                  </span>
                </div>
              )
            )}
          </div>

          {/* Amenities */}
          <h3 className="black-text">Amenities</h3>
          <div className="furnished-icons">
            {hostelData?.amenities?.ac && (
              <span>
                <FaFan /> AC
              </span>
            )}
            {hostelData?.amenities?.tv && (
              <span>
                <FaTv /> TV
              </span>
            )}
            {hostelData?.amenities?.bed && (
              <span>
                <FaBed /> Bed
              </span>
            )}
            {hostelData?.amenities?.fan && (
              <span>
                <FaFan /> Fan
              </span>
            )}
            {hostelData?.amenities?.gym && (
              <span>
                <FaDoorClosed /> Gym
              </span>
            )}
            {hostelData?.amenities?.food && (
              <span>
                <FaLightbulb /> Food Included
              </span>
            )}
            {hostelData?.amenities?.wifi && (
              <span>
                <FaWifi /> Free WiFi
              </span>
            )}
            {hostelData?.amenities?.water && (
              <span>
                <FaShower /> Water
              </span>
            )}
            {hostelData?.amenities?.geyser && (
              <span>
                <FaShower /> Geyser
              </span>
            )}
            {hostelData?.amenities?.lights && (
              <span>
                <FaLightbulb /> Lights
              </span>
            )}
            {hostelData?.amenities?.parking && (
              <span>
                <FaParking /> Parking
              </span>
            )}
            {hostelData?.amenities?.cupboard && (
              <span>
                <FaDoorClosed /> Cupboard
              </span>
            )}
          </div>

          {/* Rules */}
          <h3 className="black-text">PG Rules</h3>
          <div className="pg-rules">
            {hostelData?.rules?.length > 0 ? (
              hostelData.rules.map((rule, idx) => (
                <span className="black-text" key={idx}>
                  {rule === "No Smoking" && <MdOutlineSmokeFree />}
                  {rule === "No Alcohol" && <MdNoDrinks />}
                  {rule === "No Pets" && <FaLock />}
                  {rule === "Keep Clean" && <FaLightbulb />}
                  {rule}
                </span>
              ))
            ) : (
              <span className="black-text">No rules available.</span>
            )}
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="black-text">PG Reviews</h2>
            <div className="rating">
              <span>Overall Rating: {hostelData.rating || "N/A"}</span>
              <FaStar color="#FFD700" />
            </div>

            {hostelData.reviews?.length ? (
              hostelData.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className={`review-card ${
                    currentReviewIndex === idx ? "active" : ""
                  }`}
                >
                  <p className="black-text">
                    ⭐ {review.rating || "No rating"}{" "}
                    {review.review_text || "No review text."}
                  </p>
                </div>
              ))
            ) : (
              <p className="black-text">No reviews available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Food Menu */}
      <div className="food-menu">
        <h2 className="black-text">Food Menu</h2>
        {menuLoading ? (
          <p>Loading food menu...</p>
        ) : foodMenu.length ? (
          <table>
            <thead>
              <tr>
                <th>DAY</th>
                <th>BREAKFAST</th>
                <th>LUNCH</th>
                <th>DINNER</th>
              </tr>
            </thead>
            <tbody>
              {foodMenu.map((day, idx) => (
                <tr key={idx}>
                  <td>{day.day}</td>
                  <td>
                    {Array.isArray(day.breakfast)
                      ? day.breakfast.join(", ")
                      : day.breakfast
                          ?.split(/[\n,]+/)
                          .map((i) => i.trim())
                          .filter(Boolean)
                          .join(", ")}
                  </td>
                  <td>
                    {Array.isArray(day.lunch)
                      ? day.lunch.join(", ")
                      : day.lunch
                          ?.split(/[\n,]+/)
                          .map((i) => i.trim())
                          .filter(Boolean)
                          .join(", ")}
                  </td>
                  <td>
                    {Array.isArray(day.dinner)
                      ? day.dinner.join(", ")
                      : day.dinner
                          ?.split(/[\n,]+/)
                          .map((i) => i.trim())
                          .filter(Boolean)
                          .join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No food menu available.</p>
        )}
      </div>

      {/* Book Now */}
      <div className="book-now">
        <button className="book-now-btn" onClick={handleBookNow}>
          Book Now
        </button>{" "}
      </div>

      {isPopupOpen && (
        <Popup
          hostel={hostelData}
          onClose={() => setIsPopupOpen(false)}
          onContinue={handleContinue}
        />
      )}
    </div>
  );
};

export default HostelPage;
