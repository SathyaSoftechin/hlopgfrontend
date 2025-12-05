import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserPanel.css";
import { FaPlus, FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../api";

const UserPanel = ({ onSave, onLogout }) => {
  const [activeSection, setActiveSection] = useState("basic-info");
  const [user, setUser] = useState({});
  const [draftUser, setDraftUser] = useState({});
  const [message, setMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [modalClosing, setModalClosing] = useState(false);
  const [animateSidebar, setAnimateSidebar] = useState(false);
  const [animateGreeting, setAnimateGreeting] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [passwordRules, setPasswordRules] = useState({
    length: false,
    letter: false,
    number: false,
    symbol: false,
  });
  const [confirmValid, setConfirmValid] = useState(true);

  const navigate = useNavigate();

  // ✅ Verify token & fetch user details
  useEffect(() => {
    const verifyAndFetchUser = async () => {
      const token = localStorage.getItem("hlopgToken");
      const owner =localStorage.getItem("hlopgOwner");
      if (!token) {
        navigate("/RoleSelection");
        return;
      }
      if (owner){
        navigate("/owner-dashboard");
         return;
      }

      try {
        // Verify token
        const verifyRes = await api.get("/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (verifyRes.status === 200) {
          // Token valid, fetch user
          try {
          const userRes = await api.get("/auth/userid", {
            headers: { Authorization: `Bearer ${token}` },
          });

            if (userRes.status === 200) {``
              setUser(userRes.data);
              setDraftUser(userRes.data);
            } else {
              alert("Failed to fetch user details.");
            }
          } catch (fetchErr) {
            console.error("User fetch error:", fetchErr);
            alert("Failed to fetch user details.");
          }
        } else {
          throw new Error("Invalid token");
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("hlopgToken");
        localStorage.removeItem("hlopgUser");
        localStorage.removeItem("hlopgOwner");
        navigate("/RoleSelection");
      }
    };

    verifyAndFetchUser();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) setDraftUser({ ...draftUser, profileImage: URL.createObjectURL(file) });
  };

  const handleAadhaarChange = (side, e) => {
    const file = e.target.files[0];
    if (file) setDraftUser({ ...draftUser, [side]: URL.createObjectURL(file) });
  };

  const handleInputChange = (field, value) => setDraftUser({ ...draftUser, [field]: value });

  const handleSaveChanges = () => {
    setUser({ ...draftUser });
    setAnimateSidebar(true);
    setAnimateGreeting(true);
    if (onSave) onSave(draftUser);
    setMessage("Changes saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  useEffect(() => {
    if (animateSidebar) {
      const timer = setTimeout(() => setAnimateSidebar(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateSidebar]);

  useEffect(() => {
    if (animateGreeting) {
      const timer = setTimeout(() => setAnimateGreeting(false), 500);
      return () => clearTimeout(timer);
    }
  }, [animateGreeting]);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    setModalClosing(false);
  };

  const closeLogoutModal = () => {
    setModalClosing(true);
    setTimeout(() => {
      setShowLogoutModal(false);
      setModalClosing(false);
    }, 300);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("hlopgToken");
    localStorage.removeItem("hlopgUser");
    localStorage.removeItem("hlopgOwner");
    navigate("/");
    closeLogoutModal();
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeLogoutModal();
  };

  const handlePasswordChange = (field, value) => {
    setPasswords({ ...passwords, [field]: value });

    if (field === "new") {
      setPasswordRules({
        length: value.length >= 6,
        letter: /[a-zA-Z]/.test(value),
        number: /\d/.test(value),
        symbol: /[^a-zA-Z0-9]/.test(value),
      });
      setConfirmValid(value === passwords.confirm || passwords.confirm === "");
    } else if (field === "confirm") {
      setConfirmValid(value === passwords.new);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "basic-info":
        return (
          <>
            <h3>USER INFORMATION</h3>
            <div className="info-section">
              <div className="profile">
                <div className="profile-image">
                  <img
                    src={draftUser.profileImage || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
                    alt="Profile"
                  />
                </div>
                <label htmlFor="profileUpload" className="change-btn">Change</label>
                <input type="file" id="profileUpload" accept="image/*" onChange={handleProfileChange} hidden />
              </div>

              <div className="info-form">
                {[
                  { label: "Name", field: "name", type: "text" },
                  { label: "Email", field: "email", type: "email" },
                  { label: "Mobile Number", field: "phone", type: "text" },
                  { label: "Gender", field: "gender", type: "text" },
                  { label: "City", field: "city", type: "text" },
                ].map((f, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{f.label}</label>
                    <input type={f.type} value={draftUser[f.field] || ""} onChange={(e) => handleInputChange(f.field, e.target.value)} />
                  </div>
                ))}

                <div className="aadhaar-section">
                  <label>Aadhaar</label>
                  <div className="aadhaar-boxes">
                    {["aadhaarFront", "aadhaarBack"].map((side) => (
                      <div className="aadhaar-box" key={side}>
                        <label htmlFor={side}>
                          {draftUser[side] ? (
                            <img src={draftUser[side]} alt={side} className="aadhaar-preview" />
                          ) : (
                            <>
                              <FaPlus className="plus-icon" />
                              <p>{side === "aadhaarFront" ? "Front side Picture" : "Back side Picture"}</p>
                            </>
                          )}
                        </label>
                        <input type="file" id={side} accept="image/*" onChange={(e) => handleAadhaarChange(side, e)} hidden />
                      </div>
                    ))}
                  </div>
                </div>

                <button className="save-btn" onClick={handleSaveChanges}>Save Changes</button>
                {message && <p className="save-message">{message}</p>}
              </div>
            </div>
          </>
        );

      case "booked-pg":
        return (
          <>
            <h3>BOOKED PG’S LIST</h3>
            <div className="pg-list">
              {user?.bookedPGs?.length ? (
                user.bookedPGs.map((pg, idx) => <div className="pg-card" key={idx}>🏠 {pg}</div>)
              ) : (<p>No booked PGs.</p>)}
            </div>
          </>
        );

      case "liked-pg":
        return (
          <>
            <h3>LIKED PG’S LIST</h3>
            <div className="pg-list">
              {user?.likedPGs?.length ? (
                user.likedPGs.map((pg, idx) => <div className="pg-card liked" key={idx}>❤️ {pg}</div>)
              ) : (<p>No liked PGs.</p>)}
            </div>
          </>
        );

      case "payment-history":
        return (
          <>
            <h3>PAYMENT HISTORY</h3>
            <table className="payment-table">
              <thead><tr><th>Date</th><th>PG Name</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {user?.payments?.length ? (
                  user.payments.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.date}</td>
                      <td>{p.pgName}</td>
                      <td>₹{p.amount}</td>
                      <td>{p.status}</td>
                    </tr>
                  ))
                ) : (<tr><td colSpan="4" style={{ textAlign: "center" }}>No payments yet.</td></tr>)}
              </tbody>
            </table>
          </>
        );

      case "change-password":
        return (
          <>
            <h3>CHANGE PASSWORD</h3>
            <div className="password-form">
              {[
                { label: "Current Password", field: "current", show: showCurrent, setShow: setShowCurrent },
                { label: "New Password", field: "new", show: showNew, setShow: setShowNew },
                { label: "Confirm Password", field: "confirm", show: showConfirm, setShow: setShowConfirm },
              ].map((p, idx) => (
                <div className="form-group password-group" key={idx}>
                  <label>{p.label}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={p.show ? "text" : "password"}
                      placeholder={`Enter ${p.label.toLowerCase()}`}
                      value={passwords[p.field]}
                      onChange={(e) => handlePasswordChange(p.field, e.target.value)}
                      className={p.field === "confirm" && !confirmValid ? "invalid" : ""}
                    />
                    <span onClick={() => p.setShow(!p.show)}>
                      {p.show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {p.field === "confirm" && !confirmValid && <p className="confirm-error">Passwords do not match</p>}
                </div>
              ))}

              <div className="password-rules">
                <p className={passwordRules.length ? "valid" : ""}>• At least 6 characters</p>
                <p className={passwordRules.letter ? "valid" : ""}>• Includes letters</p>
                <p className={passwordRules.number ? "valid" : ""}>• Includes numbers</p>
                <p className={passwordRules.symbol ? "valid" : ""}>• Includes symbols</p>
              </div>

              <button className="save-btn">Update Password</button>
            </div>
          </>
        );

      case "terms":
        return (
          <>
            <h3>TERMS AND CONDITIONS</h3>
            <div className="terms-box">
              <p>{user?.terms || "Default Terms and Conditions content..."}</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="account-container">
        <div className="sidebar">
          <div className={`sidebar-preview ${animateSidebar ? "fade-update" : ""}`}>
            <div className="sidebar-profile-image">
              <img
                src={user.profileImage || "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"}
                alt="Profile"
              />
            </div>
          </div>

          <div className={`sidebar-greeting ${animateGreeting ? "fade-greeting" : ""}`}>
            Hello, {user.name || "User"}!
          </div>

          {[
            { id: "basic-info", label: "Basic Information" },
            { id: "booked-pg", label: "Booked PG’s List" },
            { id: "liked-pg", label: "Liked PG’s List" },
            { id: "payment-history", label: "Payment History" },
            { id: "change-password", label: "Change Password" },
            { id: "terms", label: "Terms and Conditions" },
          ].map((section) => (
            <button
              key={section.id}
              className={activeSection === section.id ? "active" : ""}
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
          <button className="logout" onClick={openLogoutModal}>Logout</button>
        </div>

        <div className="main-content">{renderSection()}</div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className={`modal ${modalClosing ? "fade-out" : ""}`}>
            <button className="modal-close" onClick={closeLogoutModal}><FaTimes /></button>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeLogoutModal}>Cancel</button>
              <button className="modal-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPanel;
