import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation} from "react-router-dom";
import Header from "./Header"; // ✅ Reuse global Header
import "./StudentLogin.css";
import api from "../api.jsx";


const StudentLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/"; // fallback to home
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
      const [error, setError] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
   useEffect(() => {
      setError("");
      const token = localStorage.getItem("hlopgToken");
      const user = localStorage.getItem("hlopgUser");
      const owner = localStorage.getItem("hlopgOwner");
  
      if (token && user) {
        navigate("/user-dashboard");
      } else if (token && owner) {
        navigate("/owner-dashboard");
      }
    }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Student Login Data:", formData);

     try {
      const res = await api.post("/auth/loginuser", {formData});
      console.log(res.data); 
       const { token, user } = res.data;
      // Save token and user in localStorage
      localStorage.setItem("hlopgToken", token);
      localStorage.setItem("hlopgUser", JSON.stringify(user));
      if(!token || !user){
        setError("Login failed");
        return;
      }
      else{
        console.log("Student Login successful");
      navigate(redirectTo); // redirect back to hostel page
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    
    <div className="student-login-container">
      
      <h2>Student / Professional Login</h2>

      {error && <div className="error-message">{error}</div>}

      <form className="student-login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
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
          <Link to="/student-forgot-password">Forgot Password?</Link>
        </div>

        <button type="submit">Log In</button>
      </form>

      <p className="student-signup-link">
        Don’t have an account? <Link to="/student-signup">Create Account</Link>
      </p>
    </div>
  );
};

export default StudentLogin;
