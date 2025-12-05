// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./Dashboard.css";
import api from "../api";   // <-- Make sure api is imported if used


// Image Imports
import pg1 from "../assets/pg1.png";
// import pg2 from "../assets/pg2.png";
import userImg from "../assets/user.png";

const Dashboard = ({ user }) => {
  const [pgUpdate, setPgUpdate] = useState(
    "Update here Any new Rules / Food Changes / New things ETC..."
  );
  const [isEditing, setIsEditing] = useState(false);
  const [pgs, setPgs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");
const [bookingsCount, setBookingsCount] = useState(0);
const [totalAmount, setTotalAmount] = useState(0);

const ownerId = user?.owner_id; 
console.log("Owner ID in Dashboard:", ownerId);


// Fetch Bookings Count & Total Amount
useEffect(() => {
  const fetchBookings = async () => {
    try {
      const res = await api.get(`/booking/owner/${ownerId}`);

      const bookings = res.data.bookings || [];

      setBookingsCount(bookings.length);

      // Calculate total amount
      const amount = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
      setTotalAmount(amount);

    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  if (ownerId) {
    fetchBookings();
  }
}, [ownerId]);


// Fetch Owner PGs
useEffect(() => {
  const fetchOwnerPGs = async () => {
    try {
      const res = await api.get(`/owner/pgs/${ownerId}`);
      setPgs(res.data.data || res.data); 
    } catch (err) {
      console.error("Error fetching PGs:", err);
      setError("Failed to load PGs");
    } finally {
      setLoading(false);
    }
  };

  if (ownerId) {
    fetchOwnerPGs();
  }
}, [ownerId]);

  const chartData = [
    { date: "17 SEP", bookings: 4 },
    { date: "18 SEP", bookings: 5 },
    { date: "19 SEP", bookings: 6 },
    { date: "20 SEP", bookings: 4 },
    { date: "21 SEP", bookings: 7 },
    { date: "22 SEP", bookings: 5 },
    { date: "23 SEP", bookings: 8 },
  ];

  return (
    <div className="dashboard-container">
      {/* Top Greeting */}
     <h3 className="welcome-text">
  Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
  <span className="highlight">HloPG</span> Admin!
</h3>


      {/* My PGs Section */}
      {/* My PGs Section */}
<section className="my-pgs-section">
  <h4 className="section-title">My PG’s</h4>

  {loading ? (
    <p>Loading PGs...</p>
  ) : error ? (
    <p style={{ color: "red" }}>{error}</p>
  ) : (
    <div className="pg-cards">
      {pgs.length === 0 ? (
        <p>No PGs found</p>
      ) : (
        pgs.map((pg) => (
          <div className="pg-card" key={pg._id}>
            <img 
              src={pg.image || pg1} 
              alt={pg.hostel_name} 
            />
            <p>{pg.hostel_name}</p>
          </div>
        ))
      )}
    </div>
  )}
</section>



      {/* PG Updates Section */}
      <section className="pg-updates">
        <h4 className="section-title">PG Daily Updates</h4>
        <div className="update-box">
          {isEditing ? (
            <textarea
              value={pgUpdate}
              onChange={(e) => setPgUpdate(e.target.value)}
              className="editable-textarea"
              rows="4"
            />
          ) : (
            <p className="pg-update-text">{pgUpdate}</p>
          )}
          <div className="update-actions">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="edit-btn"
            >
              {isEditing ? "Save" : "Edit"}
            </button>
            {/* <button className="today-btn">Today</button> */}
          </div>
        </div>
      </section>

      {/* Members Lists */}
      <section className="members-lists">
        <div className="members-table">
          <h4 className="section-title">Members-in List</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Share Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chaitanya</td>
                <td>22</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Thota</td>
                <td>23</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="members-table">
          <h4 className="section-title">Members-out List</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Share Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Chaitanya</td>
                <td>23</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Thota</td>
                <td>24</td>
                <td>2</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Bookings Section */}
      <section className="bookings-section">
        <div className="booking-header">
          <div className="booking-info">
           <p>
          <b>Number of Bookings :</b> {bookingsCount}
        </p>
        <p>
          <b>Amount Received :</b> ₹ {totalAmount}
        </p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5B5FF8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#5B5FF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#5B5FF8"
              fillOpacity={1}
              fill="url(#colorBookings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* Complaints */}
      <section className="complaints-section">
        <h4 className="section-title">Complaints</h4>
        <div className="cards">
          {[1, 2, 3].map((i) => (
            <div className="card" key={i}>
              <img src={userImg} alt="user" className="user-img" />
              <div>
                <h5>Chaitanya Thota</h5>
                <p>Hlo PG made finding my perfect PG Hostel so easy!</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="reviews-section">
        <h4 className="section-title">Reviews</h4>
        <div className="cards">
          {[1, 2, 3].map((i) => (
            <div className="card" key={i}>
              <img src={userImg} alt="user" className="user-img" />
              <div>
                <h5>Chaitanya Thota</h5>
                <p>
                  Hlo PG made finding my perfect PG Hostel so easy! The verified
                  listings gave me peace of mind.
                </p>
                <div className="stars">⭐⭐⭐⭐⭐</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;



// dashboar backupp