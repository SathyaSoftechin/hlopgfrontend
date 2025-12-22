// Home.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import {
  FaHeart,
  FaStar,
  FaBed,
  FaUtensils,
  FaBroom,
  FaShower,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import api from "../api";
import defaultPGImg from "../assets/pg1.jpg";
import hyderabadBg from "../assets/hyderabad.png";
import chennaiBg from "../assets/chennai.png";
import mumbaiBg from "../assets/mumbai.png";
import bangaloreBg from "../assets/bangalore.png";
import logo from "../assets/logo.png";

const PLAYSTORE_LINK = "https://play.google.com/";
const APPSTORE_LINK = "https://www.apple.com/app-store/";

function Home() {
  const navigate = useNavigate();
  const pgRefs = useRef([]);
  const [arrowVisibility, setArrowVisibility] = useState([]);
  const [hostels, setHostels] = useState([]);

  /* ---------------- Fetch Hostels ---------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/hostel/gethostels");
        setHostels(res.data || []);
      } catch (err) {
        console.error("Error fetching hostels:", err);
      }
    };
    fetchData();
  }, []);

  /* ---------------- Cities ---------------- */
  const [cities, setCities] = useState([
    { name: "Hostel's in Hyderabad", bg: hyderabadBg, pgList: [] },
    { name: "Hostel's in Chennai", bg: chennaiBg, pgList: [] },
    { name: "Hostel's in Mumbai", bg: mumbaiBg, pgList: [] },
    { name: "Hostel's in Bangalore", bg: bangaloreBg, pgList: [] },
    { name: "Hostel's in Vizag", bg: bangaloreBg, pgList: [] },
  ]);

  useEffect(() => {
    if (hostels.length > 0) {
      setCities((prevCities) =>
        prevCities.map((city) => {
          const filtered = hostels.filter((h) =>
            city.name.toLowerCase().includes(h.city?.toLowerCase() || "")
          );

          return {
            ...city,
            pgList: filtered.map((h, i) => ({
              id: h.hostel_id || i,
              img: h.img || defaultPGImg,
              name: h.hostel_name || "Unnamed PG",
              location: h.area || h.city || "Unknown",
              rating: h.rating || 4.5,
              price: `₹${h.price || 5000}`,
              facilities: ["Beds", "Food", "Clean", "Wash"],
            })),
          };
        })
      );
    }
  }, [hostels]);

  /* ---------------- Hero Background Rotation ---------------- */
  const [currentBg, setCurrentBg] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % cities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [cities.length]);

  /* ---------------- Scroll Arrows ---------------- */
  const updateArrowVisibility = (cityIndex) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setArrowVisibility((prev) => {
      const next = [...prev];
      next[cityIndex] = {
        left: scrollLeft > 0,
        right: scrollLeft + clientWidth < scrollWidth - 1,
      };
      return next;
    });
  };

  const scrollPG = (cityIndex, direction) => {
    const container = pgRefs.current[cityIndex];
    if (!container) return;

    const scrollAmount = container.clientWidth;
    container.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => updateArrowVisibility(cityIndex), 300);
  };

  useEffect(() => {
    cities.forEach((_, i) => updateArrowVisibility(i));
  }, [cities]);

  /* ---------------- Facilities ---------------- */
  const facilityIcons = {
    Beds: <FaBed />,
    Food: <FaUtensils />,
    Clean: <FaBroom />,
    Wash: <FaShower />,
  };

  /* ---------------- APP DOWNLOAD POPUP ---------------- */
  const [showPopup, setShowPopup] = useState(false);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);

      // Lock Scroll Properly
      scrollPosRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPosRef.current}px`;
      document.body.style.width = "100%";
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const closePopup = () => {
    setShowPopup(false);

    // Restore Scroll Properly
    const scrollY = scrollPosRef.current;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  };

  /* ---------------- Render ---------------- */
  return (
    <div className="home">

      {/* ===== App Download Popup ===== */}
      {showPopup && (
        <div className="app-popup-overlay">
          <div className="app-popup-card">

            <button className="popup-close" onClick={closePopup}>
              ✕
            </button>

            <img
              src={logo}
              alt="logo"
              className="popup-app-img"
            />

            <h2>
              Download Our <span className="brand-text">HLOPG</span> Mobile App
            </h2>

            <p>Find hostels faster, easier & smarter with our app.</p>

            <div className="popup-buttons">
              <a href={PLAYSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" />
              </a>

              <a href={APPSTORE_LINK} target="_blank" rel="noopener noreferrer">
                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* ===== Hero Section ===== */}
      <div
        className="hero"
        style={{ backgroundImage: `url(${cities[currentBg].bg})` }}
      >
        <div className="overlay">
          <h1 className="title">HloPG</h1>
          <p className="subtitle">
            Because finding a PG shouldn't feel like a struggle.
          </p>
        </div>
      </div>

      {/* ===== City Sections ===== */}
      {cities.map((city, index) => {
        const cityRouteName =
          city.name.match(/in (\w+)/i)?.[1] || "unknown";

        return (
          <div key={index} className="city-section">
            <div className="city-header">
              <h2>{city.name}</h2>
              <div
                className="know-more-btn"
                onClick={() =>
                  navigate(`/city/${cityRouteName.toLowerCase()}`)
                }
              >
                See More...
              </div>
            </div>

            <div className="pg-container">
              {/* Arrows */}
              <button
                className={`arrow left ${
                  arrowVisibility[index]?.left ? "show" : "hide"
                }`}
                onClick={() => scrollPG(index, "prev")}
              >
                <FaChevronLeft />
              </button>

              <button
                className={`arrow right ${
                  arrowVisibility[index]?.right ? "show" : "hide"
                }`}
                onClick={() => scrollPG(index, "next")}
              >
                <FaChevronRight />
              </button>

              {/* Scroll */}
              <div
                className="pg-scroll"
                ref={(el) => (pgRefs.current[index] = el)}
                onScroll={() => updateArrowVisibility(index)}
              >
                <div className="pg-track">
                  {city.pgList.map((pg) => (
                    <div key={pg.id} className="pg-card new-pg-card">
                      <div
                        className="pg-card-click"
                        onClick={() => navigate(`/hostel/${pg.id}`)}
                      >
                        <div className="pg-image new-img">
                          <img src={pg.img} alt={pg.name} />
                          <FaHeart className="wishlist" />
                        </div>

                        <div className="pg-details new-details">
                          <div className="pg-header new-header">
                            <h3 className="pg-name new-name">
                              {pg.name}
                            </h3>
                            <div className="pg-rating new-rating">
                              <FaStar className="star" />
                              <span>{pg.rating}</span>
                            </div>
                          </div>

                          <p className="pg-location new-location">
                            {pg.location}
                          </p>

                          <div className="facility-row">
                            {pg.facilities.map((f, i) => (
                              <div className="facility-block" key={i}>
                                {facilityIcons[f]}
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>

                          <div className="start">Starts From</div>

                          <div className="price-row">
                            <h4 className="price">{pg.price}</h4>
                            <span className="per">Per person</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
