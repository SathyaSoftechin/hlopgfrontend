import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./OwnerForgetPassword.css";

const OwnerForgetPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Replace with actual password reset logic
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <div className="owner-forget-container">
      <h2 className="owner-forget-title">Forgot Password</h2>
      <p className="owner-forget-subtitle">
        Enter Owner's registered email to reset your password
      </p>

      <form className="owner-forget-form" onSubmit={handleSubmit}>
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

      <div className="owner-forget-back">
        <Link to="/owner-login">Back to Login</Link>
      </div>
    </div>
  );
};

export default OwnerForgetPassword;
