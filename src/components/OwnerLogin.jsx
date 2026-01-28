import React, { useState, useEffect  } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "./Header"; // ✅ Include header
import "./OwnerLogin.css";
import api from "../api.jsx";


 
const OwnerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
    const [error, setError] = useState(""); 
  
   useEffect(() => {
      setError("");
      const token = localStorage.getItem("hlopgToken");
      const user = localStorage.getItem("hlopgUser");
      const owner = localStorage.getItem("hlopgOwner");
  
      if (token && user) {
        navigate("/studentdashboard");
      } else if (token && owner) {
        navigate("/ownerdashboard");
      }
    }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
      const res = await api.post("/auth/loginowner", {formData});
      console.log(res.data); 
       const { token, owner } = res.data;
      // Save token and user in localStorage
      localStorage.setItem("hlopgToken", token);
      localStorage.setItem("hlopgOwner", JSON.stringify(owner));
      if(!token || !owner){
        setError("Login failed");
        return;
      }
      else{
        console.log("Owner Login successful");
        navigate("/owner-dashboard");
      }

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }

  };

  return (
    <>
    
      <div className="owner-login-container">
        <h2>PG / Hostel Owner Login</h2>

        <form className="owner-login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="identifier"
            placeholder="Email Address"
            value={formData.identifier}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="forgot-password">
            <Link to="/owner-forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Log In</button>
        </form>
              {error && <p className="error-message">{error}</p>}

        <p className="owner-signup-link">
          Don’t have an account? <Link to="/ownersignup">Create Account</Link>
        </p>
      </div>
    </>
  );
};

export default OwnerLogin;
