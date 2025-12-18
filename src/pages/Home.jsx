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

  /* ---------------- Render ---------------- */
  return (
    <div className="home">
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

              <div
                className="pg-scroll"
                ref={(el) => (pgRefs.current[index] = el)}
                onScroll={() => updateArrowVisibility(index)}
              >
                <div className="pg-track">
                  {city.pgList.map((pg) => (
                    <div key={pg.id} className="pg-card new-pg-card">
                      {/* 🔑 Click handler moved INSIDE */}
                      <div
                        className="pg-card-click"
                        onClick={() =>
                          navigate(`/hostel/${pg.id}`)
                        }
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
                            <span className="mdi--location-radius"></span>
                            {pg.location}
                          </p>

                          <div className="facility-row">
                            {pg.facilities.map((f, i) => (
                              <div
                                className="facility-block"
                                key={i}
                              >
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
                      {/* end pg-card-click */}
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
