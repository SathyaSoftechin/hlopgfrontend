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

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState("");

  const [bookedPGs, setBookedPGs] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      const owner = localStorage.getItem("hlopgOwner");
      if (!token) {
        navigate("/RoleSelection");
        return;
      }
      if (owner) {
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

            if (userRes.status === 200) {
              ``;
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

  useEffect(() => {
    const fetchBookedPGs = async () => {
      const token = localStorage.getItem("hlopgToken");
      if (!token) return;

      try {
        setLoadingBookings(true);

        const res = await api.get("/booking/user-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setBookedPGs(res.data.bookings || []);
        }
      } catch (error) {
        console.error("Failed to fetch booked PGs:", error);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchBookedPGs();
  }, []);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setDraftUser({ ...draftUser, profileImage: URL.createObjectURL(file) });
  };

  const handleAadhaarChange = (side, e) => {
    const file = e.target.files[0];
    if (file) setDraftUser({ ...draftUser, [side]: URL.createObjectURL(file) });
  };

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setPasswordMsg("All fields are required");
      return;
    }

    if (passwords.new !== passwords.confirm) {
      setPasswordMsg("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setPasswordMsg("");

      const token = localStorage.getItem("hlopgToken");

      const res = await api.put(
        "/auth/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordMsg(res.data.message || "Password updated successfully");

      // reset fields
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (err) {
      setPasswordMsg(
        err.response?.data?.message || "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (field, value) =>
    setDraftUser({ ...draftUser, [field]: value });

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("hlopgToken");

      const payload = {
        name: draftUser.name,
        gender: draftUser.gender,
      };

      const res = await api.put("/auth/update-basic-info", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        // Update local state with DB response
        setUser(res.data.user);
        setDraftUser(res.data.user);

        // UI animations
        setAnimateSidebar(true);
        setAnimateGreeting(true);

        if (onSave) onSave(res.data.user);

        setMessage("Changes saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update user info:", error);
      setMessage("Failed to save changes");
      setTimeout(() => setMessage(""), 3000);
    }
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
    setPasswords((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "new") {
        setPasswordRules({
          length: value.length >= 6,
          letter: /[a-zA-Z]/.test(value),
          number: /\d/.test(value),
          symbol: /[^a-zA-Z0-9]/.test(value),
        });

        setConfirmValid(updated.confirm === "" || value === updated.confirm);
      }

      if (field === "confirm") {
        setConfirmValid(value === updated.new);
      }

      return updated;
    });
  };

  const canUpdatePassword =
    passwordRules.length &&
    passwordRules.letter &&
    passwordRules.number &&
    passwordRules.symbol &&
    confirmValid;

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
                    src={
                      draftUser.profileImage ||
                      "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                    }
                    alt="Profile"
                  />
                </div>
                <label htmlFor="profileUpload" className="change-btn">
                  Change
                </label>
                <input
                  type="file"
                  id="profileUpload"
                  accept="image/*"
                  onChange={handleProfileChange}
                  hidden
                />
              </div>

              <div className="info-form">
                {[
                  {
                    label: "Name",
                    field: "name",
                    type: "text",
                    editable: true,
                  },
                  {
                    label: "Email",
                    field: "email",
                    type: "email",
                    editable: false,
                  },
                  {
                    label: "Mobile Number",
                    field: "phone",
                    type: "text",
                    editable: false,
                  },
                  {
                    label: "Gender",
                    field: "gender",
                    type: "text",
                    editable: true,
                  },
                  {
                    label: "City",
                    field: "city",
                    type: "text",
                    editable: false,
                  },
                ].map((f, idx) => (
                  <div className="form-group" key={idx}>
                    <label>{f.label}</label>
                    <input
                      type={f.type}
                      value={draftUser[f.field] || ""}
                      disabled={!f.editable}
                      className={!f.editable ? "readonly" : ""}
                      onChange={(e) =>
                        f.editable && handleInputChange(f.field, e.target.value)
                      }
                    />
                  </div>
                ))}

                <button className="save-btn" onClick={handleSaveChanges}>
                  Save Changes
                </button>

                {message && <p className="save-message">{message}</p>}
              </div>
            </div>
          </>
        );

      case "booked-pg":
        return (
          <>
            <h3>BOOKED PG’S LIST</h3>

            {loadingBookings ? (
              <p>Loading bookings...</p>
            ) : bookedPGs.length ? (
              <div className="pg-list">
                {bookedPGs.map((booking) => (
                  <div className="pg-card" key={booking.bookingId}>
                    <h4>🏠 {booking.hostelName}</h4>

                    <p>
                      📍 {booking.area}, {booking.city}
                    </p>
                    <p>🛏 Sharing: {booking.sharing}</p>
                    <p>📅 Joining Date: {booking.date}</p>
                    <p>💰 Rent: ₹{booking.rentAmount}</p>
                    <p>🔐 Deposit: ₹{booking.deposit}</p>
                    <p>💳 Total: ₹{booking.totalAmount}</p>

                    <p className={`status ${booking.status}`}>
                      Status: <strong>{booking.status}</strong>
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>No booked PGs.</p>
            )}
          </>
        );

      case "liked-pg":
        return (
          <>
            <h3>LIKED PG’S LIST</h3>
            <div className="pg-list">
              {user?.likedPGs?.length ? (
                user.likedPGs.map((pg, idx) => (
                  <div className="pg-card liked" key={idx}>
                    ❤️ {pg}
                  </div>
                ))
              ) : (
                <p>No liked PGs.</p>
              )}
            </div>
          </>
        );

      case "payment-history":
        return (
          <>
            <h3>PAYMENT HISTORY</h3>
            <table className="payment-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>PG Name</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
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
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      No payments yet.
                    </td>
                  </tr>
                )}
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
                {
                  label: "Current Password",
                  field: "current",
                  show: showCurrent,
                  setShow: setShowCurrent,
                },
                {
                  label: "New Password",
                  field: "new",
                  show: showNew,
                  setShow: setShowNew,
                },
                {
                  label: "Confirm Password",
                  field: "confirm",
                  show: showConfirm,
                  setShow: setShowConfirm,
                },
              ].map((p, idx) => (
                <div className="form-group password-group" key={idx}>
                  <label>{p.label}</label>
                  <div className="password-input-wrapper">
                    <input
                      type={p.show ? "text" : "password"}
                      placeholder={`Enter ${p.label.toLowerCase()}`}
                      value={passwords[p.field]}
                      onChange={(e) =>
                        handlePasswordChange(p.field, e.target.value)
                      }
                      className={
                        p.field === "confirm" && !confirmValid ? "invalid" : ""
                      }
                    />
                    <span onClick={() => p.setShow(!p.show)}>
                      {p.show ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                  {p.field === "confirm" && !confirmValid && (
                    <p className="confirm-error">Passwords do not match</p>
                  )}
                </div>
              ))}
              <div className="password-rules">
                <p className={passwordRules.length ? "valid" : ""}>
                  • At least 6 characters
                </p>
                <p className={passwordRules.letter ? "valid" : ""}>
                  • Includes letters
                </p>
                <p className={passwordRules.number ? "valid" : ""}>
                  • Includes numbers
                </p>
                <p className={passwordRules.symbol ? "valid" : ""}>
                  • Includes symbols
                </p>
              </div>
              <button
                className="save-btn"
                onClick={handleUpdatePassword}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
              {passwordMsg && (
                <p className="save-message">{passwordMsg}</p>
              )}{" "}
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
          <div
            className={`sidebar-preview ${animateSidebar ? "fade-update" : ""}`}
          >
            <div className="sidebar-profile-image">
              <img
                src={
                  user.profileImage ||
                  "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                }
                alt="Profile"
              />
            </div>
          </div>

          <div
            className={`sidebar-greeting ${animateGreeting ? "fade-greeting" : ""}`}
          >
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
          <button className="logout" onClick={openLogoutModal}>
            Logout
          </button>
        </div>

        <div className="main-content">{renderSection()}</div>
      </div>

      {showLogoutModal && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className={`modal ${modalClosing ? "fade-out" : ""}`}>
            <button className="modal-close" onClick={closeLogoutModal}>
              <FaTimes />
            </button>
            <p>Are you sure you want to logout?</p>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={closeLogoutModal}>
                Cancel
              </button>
              <button className="modal-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPanel;
