import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./StudentSignup.css";
import Header from "./Header";
import api from "../api.jsx";

const StudentSignup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const [errors, setErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", ""]);
  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [apiError, setApiError] = useState(""); // API error display

  const emailRef = useRef(null);
  const phoneRef = useRef(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[6-9]\d{9,11}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  useEffect(() => {
    let interval;
    if (showOTPModal && resendTimer > 0) {
      interval = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [showOTPModal, resendTimer]);

  const validateField = (name, value) => {
    let message = "";
    let isValid = false;

    switch (name) {
      case "name":
        if (!value.trim()) message = "Name is required.";
        else if (value.trim().length < 3) message = "Name must be at least 3 characters.";
        else if (value.trim().length > 22) message = "Name cannot exceed 22 characters.";
        else isValid = true;
        break;

      case "email":
        if (!emailRegex.test(value)) message = "Enter a valid email address.";
        else isValid = true;
        break;

      case "phone":
        if (!/^\d*$/.test(value)) message = "Phone number must contain only digits.";
        else if (!phoneRegex.test(value)) message = "Enter valid Indian phone number (10–12 digits).";
        else isValid = true;
        break;

      case "password":
        if (!passwordRegex.test(value)) message = "Min 6 chars, must include letters & numbers.";
        else isValid = true;
        break;

      case "confirmPassword":
        if (value !== formData.password) message = "Passwords do not match.";
        else isValid = true;
        break;

      default:
        isValid = true;
    }

    setErrors((prev) => ({ ...prev, [name]: message }));
    setValidFields((prev) => ({ ...prev, [name]: isValid }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);

    // Clear API error for the relevant field
    if ((name === "phone" && apiError.includes("Phone")) ||
        (name === "email" && apiError.includes("Email"))) {
      setApiError("");
    }
  };

  const sendOTP = () => {
    setShowOTPModal(true);
    setResendTimer(30);
    setCanResend(false);
    setOtpValues(["", "", "", ""]);
    otpRefs[0].current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    // Validate all fields
    Object.keys(formData).forEach((key) => validateField(key, formData[key]));

    if (Object.values(validFields).some((v) => !v)) return;

    try {
      const res = await api.post("/auth/registeruser", { formData });
      console.log("OTP sent:", res.data);
      sendOTP();
    } catch (err) {
      const backendMsg = err.response?.data?.message || err.response?.data?.error || "";

      if (backendMsg.includes("users_phone_key")) {
        setApiError("Phone number already exists. Please use another number.");
        phoneRef.current.focus();
      } else if (backendMsg.includes("users_email_key")) {
        setApiError("Email already registered. Please use another email or log in instead.");
        emailRef.current.focus();
      } else {
        setApiError(backendMsg || "Registration failed. Please try again.");
      }
    }
  };

  const handleOTPChange = (e, idx) => {
    const val = e.target.value.replace(/\D/, "");
    const newOtpValues = [...otpValues];
    newOtpValues[idx] = val[0] || "";
    setOtpValues(newOtpValues);
    if (val && idx < 3) otpRefs[idx + 1].current.focus();
    if (!val && idx > 0) otpRefs[idx - 1].current.focus();
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    const enteredOTP = otpValues.join("");

    try {
      const res = await api.post("/auth/verify-otp", {
        identifier: formData.phone,
        otp_code: enteredOTP,
        purpose: "registration",
      });

      if (res.data.success) {
        alert(res.data.message);
        setShowOTPModal(false);
        navigate("/studentlogin");
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  const resendOTP = async () => {
    try {
      const res = await api.post("/auth/resend-otp", {
        identifier: formData.phone,
        purpose: "registration",
      });
      setResendTimer(20);
      setCanResend(false);
      setOtpValues(["", "", "", ""]);
      otpRefs[0].current.focus();
      setOtpError("OTP resent successfully!");
    } catch (err) {
      setOtpError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <>
      <Header />

      <div className="student-signup-container">
        <h2>Student / Professional Signup</h2>

        <form className="student-signup-form" onSubmit={handleSubmit}>
          <div className="input-with-status">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={validFields.name ? "valid-input" : errors.name ? "invalid-input" : ""}
              required
            />
            {validFields.name && <span className="valid-tick">✓</span>}
          </div>

          <div className="input-with-status">
            <input
              ref={emailRef}
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={validFields.email ? "valid-input" : errors.email ? "invalid-input" : ""}
              required
            />
            {validFields.email && <span className="valid-tick">✓</span>}
          </div>

          <div className="input-with-status">
            <input
              ref={phoneRef}
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={validFields.phone ? "valid-input" : errors.phone ? "invalid-input" : ""}
              required
            />
            {validFields.phone && <span className="valid-tick">✓</span>}
          </div>

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className={validFields.gender ? "valid-input" : ""}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <div className="input-with-status">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={validFields.password ? "valid-input" : errors.password ? "invalid-input" : ""}
              required
            />
            {validFields.password && <span className="valid-tick">✓</span>}
          </div>

          <div className="input-with-status">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={validFields.confirmPassword ? "valid-input" : errors.confirmPassword ? "invalid-input" : ""}
              required
            />
            {validFields.confirmPassword && <span className="valid-tick">✓</span>}
          </div>

          {Object.values(errors).some((msg) => msg) && (
            <div className="error-message">
              {Object.values(errors)
                .filter((msg) => msg)
                .map((msg, i) => (
                  <div key={i}>• {msg}</div>
                ))}
            </div>
          )}

          {apiError && <p className="error-message">{apiError}</p>}

          <button type="submit">Sign Up</button>
        </form>

        <p className="student-login-link">
          Already have an account? <Link to="/StudentLogin">Log in</Link>
        </p>
      </div>

      {showOTPModal && (
        <div className="otp-modal">
          <div className="otp-modal-content">
            <h3>Enter OTP</h3>
            <p>An OTP has been sent to your phone: {formData.phone}</p>
            <form onSubmit={verifyOTP} className="otp-form">
              <div className="otp-inputs">
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength="1"
                    value={val}
                    ref={otpRefs[idx]}
                    onChange={(e) => handleOTPChange(e, idx)}
                    required
                  />
                ))}
              </div>
              {otpError && <p className="otp-error-message">{otpError}</p>}
              <div className="otp-actions">
                <button type="submit">Verify OTP</button>
                <button
                  type="button"
                  className="otp-cancel-btn"
                  onClick={() => setShowOTPModal(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="resend-section">
                <button type="button" disabled={!canResend} onClick={resendOTP}>
                  Resend OTP {canResend ? "" : `(${resendTimer}s)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentSignup;
