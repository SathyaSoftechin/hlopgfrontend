import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelection.css";
import Header from "./Header";

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  // ✅ Check for JWT token and redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("hlopgToken");
    const user = localStorage.getItem("hlopgUser");
    const owner = localStorage.getItem("hlopgOwner");

    if (token && user) {
      navigate("/user-dashboard");
    } else if (token && owner) {
      navigate("/owner-dashboard");
    }
  }, [navigate]);

  const handleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSignIn = () => {
    if (selectedRole === "student") {
      navigate("/StudentLogin");
    } else if (selectedRole === "owner") {
      navigate("/OwnerLogin");
    } else {
      alert("Please select a role before proceeding!");
    }
  };

  return (
    <div className="role-container">
       <main style={{ paddingTop: "70px" }}>
        <Header />
      </main>
      <h2>Join as a User or Owner</h2>

      <div className="role-options">
        <div
          className={`role-card ${selectedRole === "student" ? "selected" : ""}`}
          onClick={() => handleSelect("student")}
        >
          <span role="img" aria-label="student" className="role-icon">
            <span class="bi--people-fill"></span>
          </span>
          <p>
            I’m a Student or Professional,<br />looking for a PG / Hostels
          </p>
        </div>

        <div
          className={`role-card ${selectedRole === "owner" ? "selected" : ""}`}
          onClick={() => handleSelect("owner")}
        >
          <span role="img" aria-label="owner" className="role-icon">
            <span class="fluent--building-people-24-filled"></span>
          </span>
          <p>
            I’m an Owner,<br />hosting a PG / Hostels
          </p>
        </div>
      </div>

      <button
        className="create-btn"
        disabled={!selectedRole}
        onClick={handleSignIn}
      >
        Sign In
      </button>
    </div>
  );
};

export default RoleSelection;
