// src/components/Popup.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Popup.css";

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

import pg1 from "../assets/pg1.jpg";
import pg2 from "../assets/pg2.jpg";
import pg3 from "../assets/pg3.jpg";
import pg4 from "../assets/pg4.jpg";
import pg5 from "../assets/pg5.png";

const Popup = ({ hostel = {}, onClose = () => {}, onContinue = () => {} }) => {
  // local state
  const [selectedOption, setSelectedOption] = useState(null);
  const [date, setDate] = useState(null);
  const [numDays, setNumDays] = useState("");
  // const [frontAadhar, setFrontAadhar] = useState(null);
  // const [backAadhar, setBackAadhar] = useState(null);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [priceType, setPriceType] = useState("monthly");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const today = new Date();
  const maxDate = new Date();
  maxDate.setMonth(today.getMonth() + 2);

  const fallbackImages = [pg1, pg2, pg3, pg4, pg5];
  const images = Array.isArray(hostel.images) && hostel.images.length > 0 ? hostel.images : fallbackImages;

  const sharing = hostel?.sharing || {};
  const amenities = hostel?.amenities || {};
  const rules = hostel?.rules && hostel.rules.length ? hostel.rules : ["No Alcohol", "No Smoking"];
  const deposit = Number(hostel?.deposit || 0);

  // Prevent background scroll while popup open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleEsc);
      // revoke object urls if any
      // if (typeof frontAadhar === "string" && frontAadhar.startsWith("blob:")) URL.revokeObjectURL(frontAadhar);
      // if (typeof backAadhar === "string" && backAadhar.startsWith("blob:")) URL.revokeObjectURL(backAadhar);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep selectedOption price in displayed units (do not mutate original object)
  const getDisplayedPrice = (price) => {
    if (price == null) return 0;
    return priceType === "daily" ? Math.round(Number(price) / 30) : Number(price);
  };

  // update displayed price when priceType or selection changes
  useEffect(() => {
    if (!selectedOption) return;
    const displayed = getDisplayedPrice(selectedOption.originalPrice);
    setSelectedOption((prev) => ({ ...prev, price: displayed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceType]);

  // const handleFileChange = (e, setter) => {
  //   if (!e.target.files || !e.target.files[0]) return;
  //   const file = e.target.files[0];
  //   const url = URL.createObjectURL(file);
  //   setter(url);
  // };

  const baseRent = selectedOption ? Number(selectedOption.price || 0) : 0;

  const rentAmount = priceType === "daily" ? baseRent * (numDays ? parseInt(numDays, 10) : 0) : baseRent;
  const totalAmount = rentAmount + deposit;

  const isPayEnabled =
    selectedOption &&
    date &&
    acceptedTerms &&
    (priceType === "monthly" ? true : numDays && parseInt(numDays, 10) > 0);

  const prevMainImage = () => setMainImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const nextMainImage = () => setMainImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

  const handleNumDaysChange = (e) => {
    let v = e.target.value;
    if (v === "") return setNumDays("");
    v = Math.min(Math.max(1, parseInt(v, 10)), 60);
    setNumDays(v);
  };

  const handleOverlayClick = (e) => {
    // clicking on overlay closes
    if (e.target.classList.contains("popup-overlay-root")) handleClose();
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleProceed = () => {
    if (!isPayEnabled) return;
    const bookingData = {
      sharing: selectedOption?.sharing,
      priceType,
      numDays: priceType === "daily" ? Number(numDays) : undefined,
      months: priceType === "monthly" ? 1 : undefined,
      date,
      rentAmount,
      totalAmount,
      deposit,
      // frontAadhar,
      // backAadhar,
    };
    onContinue(bookingData);
  };

  // If popup-root missing, render inline as fallback
  const mountNode = typeof document !== "undefined" ? document.getElementById("popup-root") || document.body : null;

  const content = (
    <div className="popup-overlay-root" onMouseDown={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="popup-container" onMouseDown={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose} aria-label="Close popup">
          ×
        </button>

        <h2 className="popup-title">Book Your PG</h2>

        <div className="popup-body">
          {/* LEFT */}
          <div className="popup-left">
            <h3 className="pg-title">{hostel.hostel_name || "Hostel"}</h3>
            <p className="pg-sub">{hostel.address}</p>

            <div className="pg-image-wrapper">
              <button className="main-arrow left" onClick={prevMainImage} aria-label="Previous image">
                <FaChevronLeft />
              </button>

              <div className="pg-image">
                <img src={images[mainImageIndex]} alt="PG" />
              </div>

              <button className="main-arrow right" onClick={nextMainImage} aria-label="Next image">
                <FaChevronRight />
              </button>
            </div>

            <div className="image-thumbs-wrapper">
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
            </div>

            <div className="price-type-toggle" role="tablist" aria-label="Price type toggle">
              <span
                className={`pill-option ${priceType === "daily" ? "active" : ""}`}
                onClick={() => setPriceType("daily")}
                role="button"
              >
                Day Wise
              </span>
              <span
                className={`pill-option ${priceType === "monthly" ? "active" : ""}`}
                onClick={() => setPriceType("monthly")}
                role="button"
              >
                Monthly Wise
              </span>
            </div>

            <div className="sharing-info">
              {selectedOption ? (
                <p>
                  <b>Selected Sharing:</b> {selectedOption.sharing} ₹{selectedOption.price} (
                  {priceType === "daily" ? "Per Day" : "Per Month"})
                </p>
              ) : (
                <p>Select your sharing preference</p>
              )}
            </div>

            <div className="price-options">
              {Object.entries(sharing).length ? (
                Object.entries(sharing).map(([sharingType, price], idx) => {
                  const displayed = getDisplayedPrice(price);
                  return (
                    <button
                      key={idx}
                      className={`price-btn ${selectedOption?.sharing === sharingType ? "active" : ""}`}
                      onClick={() =>
                        setSelectedOption({
                          sharing: sharingType,
                          price: displayed,
                          originalPrice: price,
                        })
                      }
                    >
                      {sharingType} ₹{displayed}
                    </button>
                  );
                })
              ) : (
                <div className="no-sharing">No sharing information available</div>
              )}
            </div>

            <h3>Furnished</h3>
            <div className="furnished-icons">
              {amenities?.wifi && <span><FaWifi /> WiFi</span>}
              {amenities?.fan && <span><FaFan /> Fan</span>}
              {amenities?.bed && <span><FaBed /> Bed</span>}
              {amenities?.tv && <span><FaTv /> TV</span>}
              {amenities?.lights && <span><FaLightbulb /> Lights</span>}
              {amenities?.cupboard && <span><FaDoorClosed /> Cupboard</span>}
              {amenities?.hot_water && <span><FaShower /> Hot Water</span>}
              {amenities?.parking && <span><FaParking /> Parking</span>}
              {amenities?.cc_camera && <span><BiCctv /> CC Camera</span>}
            </div>

            <h3>PG Rules</h3>
            <div className="pg-rules">
              {rules.includes("No Alcohol") && <span><MdNoDrinks /> No Alcohol</span>}
              {rules.includes("No Smoking") && <span><MdOutlineSmokeFree /> No Smoking</span>}
            </div>
          </div>

          {/* RIGHT */}
          <div className="popup-right">
            <label className="date-label">Select Move-in Date</label>

            <Calendar
              onChange={(value) => setDate(value)}
              value={date}
              minDate={today}
              maxDate={maxDate}
              className="custom-calendar"
            />

            <div className="days-input">
              <label>{priceType === "daily" ? "Duration of Stay (Days)" : "Duration (Months)"}</label>
              <input
                type="number"
                min="1"
                max="60"
                value={numDays}
                onChange={handleNumDaysChange}
                placeholder="Enter"
                className="editable-number"
              />
            </div>

            <div className="total-box">
              <h4>Payment Summary</h4>
              <div className="total-line">
                <span>Rent ({selectedOption?.sharing || "N/A"})</span>
                <span>₹{rentAmount || 0}</span>
              </div>

              <div className="total-line">
                <span>Deposit</span>
                <span>₹{deposit}</span>
              </div>

              <div className="total-line grand">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* <div className="aadhar-section">
              <label className="upload-box">
                {frontAadhar ? (
                  <img src={frontAadhar} alt="Front Aadhaar" />
                ) : (
                  <>
                    <span>📄 Front Aadhaar</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setFrontAadhar)} />
                  </>
                )}
              </label>

              <label className="upload-box">
                {backAadhar ? (
                  <img src={backAadhar} alt="Back Aadhaar" />
                ) : (
                  <>
                    <span>📄 Back Aadhaar</span>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setBackAadhar)} />
                  </>
                )}
              </label>
            </div> */}

            <div className="terms-checkbox">
              <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
              <label htmlFor="terms">
                I agree to the <a href="/terms" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>
              </label>
            </div>

            <button className="pay-btn" disabled={!isPayEnabled} onClick={handleProceed}>
              Proceed to Pay →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!mountNode) return null;
  return createPortal(content, mountNode);
};

export default Popup;
