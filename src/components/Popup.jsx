import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";
import api, { BASE_URL } from "../api";

import {
  FaWifi,
  FaFan,
  FaBed,
  FaTv,
  FaLightbulb,
  FaDoorClosed,
  FaChevronLeft,
  FaChevronRight,
  FaShower,
  FaParking,
} from "react-icons/fa";
import { BiCctv } from "react-icons/bi";
import { MdOutlineSmokeFree, MdNoDrinks } from "react-icons/md";

// Fallback images
import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const Popup = ({ hostel = {}, onClose = () => {}, onContinue = () => {} }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [date, setDate] = useState(null);
  const [numDays, setNumDays] = useState("");
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [priceType, setPriceType] = useState("monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  /* ---------------- IMAGE LOGIC (FIXED) ---------------- */
  const fallbackImages = [pg1, pg2, pg3, pg4, pg5];

  const images =
    Array.isArray(hostel.images) && hostel.images.length > 0
      ? hostel.images.map((img) =>
          img.startsWith("http") ? img : `${BASE_URL}${img}`
        )
      : fallbackImages;

  // Reset carousel when hostel changes
  useEffect(() => {
    setMainImageIndex(0);
  }, [hostel?.images]);

  const prevMainImage = () =>
    setMainImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));

  const nextMainImage = () =>
    setMainImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  /* ---------------- DATA ---------------- */
  const sharing = hostel?.sharing || {};
  const amenities = hostel?.amenities || {};
  const rules =
    hostel?.rules && hostel.rules.length
      ? hostel.rules
      : ["No Alcohol", "No Smoking"];
  const deposit = Number(hostel?.deposit || 0);

  /* ---------------- PRICE LOGIC ---------------- */
  const getDisplayedPrice = (price) => {
    if (price == null) return 0;
    return priceType === "daily"
      ? Math.round(Number(price) / 30)
      : Number(price);
  };

  useEffect(() => {
    if (!selectedOption) return;
    const displayed = getDisplayedPrice(selectedOption.originalPrice);
    setSelectedOption((prev) => ({ ...prev, price: displayed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceType]);

  const baseRent = selectedOption ? Number(selectedOption.price || 0) : 0;
  const rentAmount =
    priceType === "daily"
      ? baseRent * (numDays ? parseInt(numDays, 10) : 0)
      : baseRent;
  const totalAmount = rentAmount + deposit;

  const isPayEnabled =
    selectedOption &&
    date &&
    acceptedTerms &&
    (priceType === "monthly"
      ? true
      : numDays && parseInt(numDays, 10) > 0);

  /* ---------------- HANDLERS ---------------- */
  const handleNumDaysChange = (e) => {
    let v = e.target.value;
    if (v === "") return setNumDays("");
    v = Math.min(Math.max(1, parseInt(v, 10)), 60);
    setNumDays(v);
  };

  const handleProceed = () => {
    if (!isPayEnabled) return;

    const finalNumDays = priceType === "daily" ? Number(numDays) : 30;

    onContinue({
      sharing: selectedOption?.sharing,
      priceType,
      numDays: finalNumDays,
      date: date.toISOString().split("T")[0],
      rentAmount,
      totalAmount,
      deposit,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("popup-overlay-root")) onClose();
  };

  /* ---------------- PREVENT BACKGROUND SCROLL ---------------- */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const mountNode =
    typeof document !== "undefined"
      ? document.getElementById("popup-root") || document.body
      : null;

  if (!mountNode) return null;

  return createPortal(
    <div
      className="popup-overlay-root"
      onMouseDown={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="popup-container" onMouseDown={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>×</button>

        <h2 className="popup-title">Book Your PG</h2>

        <div className="popup-body">
          {/* LEFT */}
          <div className="popup-left">
            <h3 className="pg-title">{hostel.hostel_name}</h3>
            <p className="pg-sub">{hostel.address}</p>

            <div className="pg-image-wrapper">
              <button className="main-arrow left" onClick={prevMainImage}>
                <FaChevronLeft />
              </button>

              <div className="pg-image">
                <img src={images[mainImageIndex]} alt="PG" />
              </div>

              <button className="main-arrow right" onClick={nextMainImage}>
                <FaChevronRight />
              </button>
            </div>

            <div className="image-thumbs">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumb-${idx}`}
                  className={mainImageIndex === idx ? "active-thumb" : ""}
                  onClick={() => setMainImageIndex(idx)}
                />
              ))}
            </div>

            <div className="price-type-toggle">
              <span
                className={`pill-option ${priceType === "daily" ? "active" : ""}`}
                onClick={() => setPriceType("daily")}
              >
                Day Wise
              </span>
              <span
                className={`pill-option ${priceType === "monthly" ? "active" : ""}`}
                onClick={() => setPriceType("monthly")}
              >
                Monthly Wise
              </span>
            </div>

            <div className="price-options">
              {Object.entries(sharing).map(([type, price], idx) => {
                const displayed = getDisplayedPrice(price);
                return (
                  <button
                    key={idx}
                    className={`price-btn ${
                      selectedOption?.sharing === type ? "active" : ""
                    }`}
                    onClick={() =>
                      setSelectedOption({
                        sharing: type,
                        price: displayed,
                        originalPrice: price,
                      })
                    }
                  >
                    {type} ₹{displayed}
                  </button>
                );
              })}
            </div>

            <h3>Furnished</h3>
            <div className="furnished-icons">
              {amenities.wifi && <span><FaWifi /> WiFi</span>}
              {amenities.fan && <span><FaFan /> Fan</span>}
              {amenities.bed && <span><FaBed /> Bed</span>}
              {amenities.tv && <span><FaTv /> TV</span>}
              {amenities.lights && <span><FaLightbulb /> Lights</span>}
              {amenities.cupboard && <span><FaDoorClosed /> Cupboard</span>}
              {amenities.hot_water && <span><FaShower /> Hot Water</span>}
              {amenities.parking && <span><FaParking /> Parking</span>}
              {amenities.cc_camera && <span><BiCctv /> CC Camera</span>}
            </div>

            <h3>PG Rules</h3>
            <div className="pg-rules">
              {rules.includes("No Alcohol") && <span><MdNoDrinks /> No Alcohol</span>}
              {rules.includes("No Smoking") && <span><MdOutlineSmokeFree /> No Smoking</span>}
            </div>
          </div>

          {/* RIGHT */}
          <div className="popup-right">
            <label>Select Move-in Date</label>

            <Calendar
              onChange={setDate}
              value={date}
              minDate={today}
              maxDate={maxDate}
            />

            <label>Duration</label>
            <input
              type="number"
              min="1"
              max="60"
              value={numDays}
              onChange={handleNumDaysChange}
              placeholder="Enter"
            />

            <div className="total-box">
              <div>Rent: ₹{rentAmount}</div>
              <div>Deposit: ₹{deposit}</div>
              <div className="grand">Total: ₹{totalAmount}</div>
            </div>

            <label className="terms">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
              />
              I agree to Terms & Conditions
            </label>

            <button
              className="pay-btn"
              disabled={!isPayEnabled}
              onClick={handleProceed}
            >
              Proceed to Pay →
            </button>
          </div>
        </div>
      </div>
    </div>,
    mountNode
  );
};

export default Popup;
