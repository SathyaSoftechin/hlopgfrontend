// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from "react";

import {
  FaUser,
  FaHome,
  FaMoneyBill,
  FaHeart,
  FaCogs,
  FaUpload,
  FaList,
  FaSignOutAlt,
} from "react-icons/fa";

import Dashboard from "./Dashboard";
import UploadPG from "./UploadPG";
 import MyPGs from "./MyPGs";
import PGMembersList from "./PGMembersList";
// import PaymentsList from "./PaymentsList";
// import Reviews from "./Reviews";
// import MyRooms from "./MyRooms";

import "./AdminPanel.css";
import { useNavigate } from "react-router-dom";
import api from "../api";   // <-- Make sure api is imported if used


const sidebarOptions = [
  { name: "Dashboard", icon: <FaHome /> },
  { name: "Upload PG", icon: <FaUpload /> },
  { name: "My PG’s", icon: <FaList /> },
  { name: "PG Members List", icon: <FaUser /> },
  { name: "Payments List", icon: <FaMoneyBill /> },
  { name: "Reviews", icon: <FaHeart /> },
  { name: "My Rooms", icon: <FaCogs /> },
];


const AdminPanel = () => {
  const [selected, setSelected] = useState("Dashboard");

  const navigate = useNavigate(); // ✅ Correct position
const [user, setUser] = useState(null);


  // ---------------- LOGOUT ----------------
  const handleLogout = () => {
    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");

    alert("Logged out successfully!");
    navigate("/");   // ✅ Now works
  };


  // ---------- AUTO AUTH CHECK ------------
  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = localStorage.getItem("hlopgToken");
      const user = localStorage.getItem("hlopgUser");

      if (!token) {
        navigate("/RoleSelection");
        return;
      }

      if (user) {
        navigate("/user-dashboard");
        return;
      }

      try {
        const verifyRes = await api.get("/auth/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (verifyRes.status === 200) {
          try {
            const userRes = await api.get("/auth/ownerid", {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (userRes.status === 200) {
              setUser(userRes.data);
              // setDraftUser(userRes.data);
            }
          } catch (fetchErr) {
            console.error("User fetch error:", fetchErr);
          }
        }
      } catch (err) {
        localStorage.removeItem("hlopgToken");
        localStorage.removeItem("hlopgUser");
        localStorage.removeItem("hlopgOwner");
        navigate("/RoleSelection");
      }
    };

    verifyAndFetchUser();
  }, [navigate]);


  // ----------- Render Selected Component ----------
  const renderComponent = () => {
    switch (selected) {
      case "Dashboard":         return <Dashboard user={user} />;
      case "Upload PG":       return <UploadPG />;
      case "My PG’s":         return <MyPGs user={user} />;
      case "PG Members List": return <PGMembersList  user={user} />;
      case "Payments List":   return <PaymentsList />;
      case "Reviews":         return <Reviews />;
      case "My Rooms":        return <MyRooms />;
      default:
        return <div className="placeholder">
          <h2>{selected}</h2>
          <p>Content coming soon...</p>
        </div>;
    }
  };


  return (
    <div className="admin-container">

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
        <div
    className="logo-container"
    style={{ cursor: "pointer" }}
    onClick={() => navigate("/")}   // ✅ Navigate to home on click
  >
    <h2 className="logo">🏠 HloPG</h2>
  </div>

          <ul className="sidebar-menu">
            {sidebarOptions.map((item) => (
              <li
                key={item.name}
                className={`menu-item ${selected === item.name ? "active" : ""}`}
                onClick={() => setSelected(item.name)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Logout */}
        <div className="logout-section">
          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h3>{selected}</h3>
          <img src="https://via.placeholder.com/35" alt="Admin" className="admin-avatar" />
        </header>

        <div className="content-body">{renderComponent()}</div>
      </main>
    </div>
  );
};

export default AdminPanel;
