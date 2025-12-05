import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./StudentForgetPassword.css";

const StudentForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with real password reset logic
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="student-forget-container">
      <h2 className="student-forget-title">Forgot Password</h2>
      <p className="student-forget-subtitle">
        Enter Your registered email to reset your password
      </p>

      <form className="student-forget-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>

      <div className="student-forget-back">
        <Link to="/student-login">Back to Login</Link>
      </div>
    </div>
  );
};

export default StudentForgetPassword;
