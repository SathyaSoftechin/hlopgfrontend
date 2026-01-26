import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaHeart,
  FaStar,
  FaShower,
  FaCheckCircle,
  FaWifi,
  FaParking,
  FaLock,
} from "react-icons/fa";
import { BiCctv } from "react-icons/bi"; // ✅ Better CCTV icon
import Header from "../../components/Header";
import api, { BASE_URL } from "../../api";

import pg1 from "../../assets/pg1.jpg";
import pg2 from "../../assets/pg2.jpg";
import pg3 from "../../assets/pg3.jpg";
import pg4 from "../../assets/pg4.jpg";

import hyderabadBg from "../../assets/hyderabad.png";
import chennaiBg from "../../assets/chennai.png";
import bangaloreBg from "../../assets/bangalore.png";
import mumbaiBg from "../../assets/mumbai.png";

import "./CityHostels.css";

const cityImages = {
  hyderabad: hyderabadBg,
  chennai: chennaiBg,
  bangalore: bangaloreBg,
  mumbai: mumbaiBg,
};

const CityHostels = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();

  const [hostels, setHostels] = useState([]);
  const [filters, setFilters] = useState({ area: "All", pg_type: "All" });

  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const endpoints = {
          hyderabad: "/hostel/hydhostels",
          chennai: "/hostel/chehostels",
          bangalore: "/hostel/benhostels",
          mumbai: "/hostel/mumhostels",
        };

        const endpoint = endpoints[cityName.toLowerCase()];
        if (!endpoint) return;

        const res = await api.get(endpoint);
        const data = res.data || [];

        const mappedHostels = data.map((h, index) => {
          let amenities = {};
          try {
            amenities =
              typeof h.amenities === "string"
                ? JSON.parse(h.amenities)
                : h.amenities || {};
          } catch {
            amenities = {};
          }

          // 🧑‍💼 Gender display icon
          let genderLabel = "👨🏻‍💼 Men's PG";
          const genderText = (h.pg_type || "").toLowerCase();
          if (genderText.includes("women")) genderLabel = "💁🏻‍♀️ Women's PG";
          else if (genderText.includes("co")) genderLabel = "👫 Co-Living";
 // 🖼️ Resolve hostel image
let img = pg1; // fallback

if (Array.isArray(h.images) && h.images.length > 0) {
  const firstImg = h.images[0];
  img = firstImg.startsWith("http")
    ? firstImg
    : `${BASE_URL}${firstImg}`;
}
          return {
            id: h.hostel_id,
            img,
            name: h.hostel_name,
            area: h.area,
            price: h.price ? `₹${h.price}` : "₹—",
            rating: h.rating || 4.5,
            amenities,
            pg_type: genderText, // ✅ for filtering
            genderLabel, // ✅ for display
          };
        });

        setHostels(mappedHostels);
      } catch (err) {
        console.error(`Error fetching ${cityName} hostels:`, err);
      }
    };

    fetchHostels();
  }, [cityName]);

  // ✅ Dynamic dropdown options
  const filterOptions = {
    area: ["All", ...new Set(hostels.map((pg) => pg.area))],
    pg_type: ["All", ...new Set(hostels.map((pg) => pg.pg_type))],
  };

  // ✅ Correct filtering logic
  const filteredPGs = hostels.filter((pg) =>
    Object.entries(filters).every(([key, value]) =>
      value === "All" ? true : pg[key] === value
    )
  );

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const cityTitle =
    cityName.charAt(0).toUpperCase() + cityName.slice(1).toLowerCase();

  return (
    <div className="city-page">
      <Header />

      <div
        className="city-hero"
        style={{ backgroundImage: `url(${cityImages[cityName.toLowerCase()]})` }}
      >
        <div className="city-overlay">
          <h1>Hostels in {cityTitle}</h1>
          <p>
            Explore the best PGs in {cityTitle} for a comfortable and convenient
            stay.
          </p>
        </div>
      </div>

      {/* ✅ Filters */}
      <div className="area-gender-filter">
        {Object.keys(filterOptions).map((key, idx) => (
          <div key={idx} className="filter-item">
            <label>{key === "pg_type" ? "Gender" : "Area"}:</label>
            <select
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            >
              {filterOptions[key].map((opt, id) => (
                <option key={id} value={opt}>
                  {opt === "All"
                    ? "All"
                    : opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* ✅ Hostel cards */}
      {filteredPGs.length === 0 ? (
        <p className="no-results">No PGs found for the selected filters.</p>
      ) : (
        <div className="pg-grid">
          {filteredPGs.map((pg) => (
            <div
              key={pg.id}
              className="pg-card"
              onClick={() => navigate(`/hostel/${pg.id}`)}
            >
              <div className="pg-image">
                <img src={pg.img} alt={pg.name} />
                <FaHeart className="wishlist" />
                <FaCheckCircle className="verified-badge" title="Verified PG" />
              </div>

              <div className="pg-info">
                <h3>{pg.name}</h3>
                <p>📍 {pg.area}</p>
                <p className="gender">{pg.genderLabel}</p>

                <div className="rating">
                  <FaStar className="star" /> {pg.rating}
                </div>

                <div className="icons">
                  {pg.amenities?.wifi && <FaWifi title="Wi-Fi" />}
                  {pg.amenities?.hot_water && <FaShower title="Hot Water" />}
                  {pg.amenities?.locker && <FaLock title="Locker" />}
                  {pg.amenities?.cc_camera && <BiCctv title="CCTV Camera" />}
                  {pg.amenities?.parking &&  <FaParking title="Parking" />}
                </div>

                <p className="price">
                  {pg.price} <span>Per person</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityHostels;
