// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
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
import api, { BASE_URL } from "../api";

import pg1 from "../assets/pg1.png";
import userImg from "../assets/user.png";

const Dashboard = ({ user }) => {
  const token = localStorage.getItem("hlopgToken");

  /* ================= SAFE DEFAULT STATES ================= */
  const [pgs, setPgs] = useState([]);
  const [pgUpdate, setPgUpdate] = useState(null);
const [membersIn, setMembersIn] = useState([]);
const [loadingMembersIn, setLoadingMembersIn] = useState(true);


  const [membersOut, setMembersOut] = useState(null);

  const [bookingsCount, setBookingsCount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [complaints, setComplaints] = useState(null);
  const [reviews, setReviews] = useState(null);

  const [loadingPGs, setLoadingPGs] = useState(true);
  const [selectedHostelId, setSelectedHostelId] = useState("");
const [sendingUpdate, setSendingUpdate] = useState(false);


  /* ================= MY PGs (WORKING & UNTOUCHED) ================= */
  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const res = await api.get("/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPgs(res.data?.data || []);
      } catch (err) {
        console.error("PG fetch failed", err);
      } finally {
        setLoadingPGs(false);
      }
    };

    fetchOwnerPGs();
  }, [token]);

  /* ================= DASHBOARD DATA (OPTIONAL) ================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/dashboard/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data || {};

        setPgUpdate(d.pgUpdate ?? null);
        setMembersIn(d.membersIn ?? null);
        setMembersOut(d.membersOut ?? null);
        setBookingsCount(d.bookingsCount ?? null);
        setTotalAmount(d.totalAmount ?? null);
        setChartData(d.bookingChart ?? null);
        setComplaints(d.complaints ?? null);
        setReviews(d.reviews ?? null);
      } catch (err) {
        console.warn("Dashboard API not ready yet");
        // ❗ DO NOTHING – keep UI alive
      }
    };

    fetchDashboardData();
  }, [token]);


  useEffect(() => {
  const fetchMembersIn = async () => {
    try {
      const res = await api.get("/owner/members-in", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMembersIn(res.data?.data || []);
    } catch (err) {
      console.error("Members IN fetch failed", err);
    } finally {
      setLoadingMembersIn(false);
    }
  };

  fetchMembersIn();
}, [token]);


// Fetch Members OUT
useEffect(() => {
  const fetchMembersOut = async () => {
    try {
      const res = await api.get("/owner/members-out", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembersOut(res.data || []);
    } catch (err) {
      console.error("Members OUT fetch failed:", err);
    }
  };

  fetchMembersOut();
}, [token]);



const handleSendPgUpdate = async () => {
  if (!selectedHostelId) {
    alert("Please select a PG");
    return;
  }

  if (!pgUpdate || !pgUpdate.trim()) {
    alert("Please enter update message");
    return;
  }

  try {
    setSendingUpdate(true);

    await api.post(
      "/owner/pg-update",
      {
        hostel_id: selectedHostelId,
        message: pgUpdate,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("PG update sent to booked users ✅");
    setPgUpdate("");
  } catch (err) {
    console.error("PG update failed:", err);
    alert("Failed to send update");
  } finally {
    setSendingUpdate(false);
  }
};

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <h3 className="welcome-text">
        Hi, <span className="highlight">{user?.name || "Owner"}</span>. Welcome to{" "}
        <span className="highlight">HloPG</span> Admin!
      </h3>

      {/* ================= MY PGs ================= */}
      <section className="my-pgs-section">
        <h4 className="section-title">My PG’s</h4>

        {loadingPGs ? (
          <p>Loading PGs…</p>
        ) : (
          <div className="pg-cards">
            {pgs.length === 0 ? (
              <p>No PGs found</p>
            ) : (
              pgs.map((pg) => (
                <div className="pg-card" key={pg._id}>
                  <img
                    src={
                      pg.images?.length
                        ? `${BASE_URL}${pg.images[0]}`
                        : pg1
                    }
                    alt={pg.hostel_name}
                  />
                  <p>{pg.hostel_name}</p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* ================= PG UPDATES ================= */}
      <section className="pg-updates">
  <h4 className="section-title">PG Daily Updates</h4>

  {/* Select PG */}
  <select
    value={selectedHostelId}
    onChange={(e) => setSelectedHostelId(e.target.value)}
  >
    <option value="">Select PG</option>
    {pgs.map((pg) => (
      <option key={pg.hostel_id} value={pg.hostel_id}>
        {pg.hostel_name}
      </option>
    ))}
  </select>

  {/* Update message */}
  <textarea
    placeholder="Enter today's PG update..."
    value={pgUpdate || ""}
    onChange={(e) => setPgUpdate(e.target.value)}
    rows={4}
  />

  {/* Send button */}
  <button
    onClick={handleSendPgUpdate}
    disabled={sendingUpdate}
  >
    {sendingUpdate ? "Sending..." : "Send Update"}
  </button>
</section>

      {/* ================= MEMBERS ================= */}
      <section className="members-lists">
        <div className="members-table">
    <h4 className="section-title">Members-in Today</h4>

    {loadingMembersIn ? (
      <p>Loading…</p>
    ) : membersIn.length === 0 ? (
      <p>No active members</p>
    ) : (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>PG Name</th>
            <th>Share Type</th>
            <th>User Phone Number</th>

          </tr>
        </thead>
       <tbody>
  {membersIn.map((m, index) => (
    <tr key={index}>
      <td>{m.name}</td>
      <td>{m.pgName}</td>
      <td>{m.shareType}</td>
      <td>{m.phone}</td>

    </tr>
  ))}
</tbody>
      </table>
    )}
  </div>

        {/* Members OUT */}
  <div className="members-table">
    <h4 className="section-title">Members-out Today</h4>
    {membersOut && membersOut.length > 0 ? (
      <table>
           <thead>
          <tr>
            <th>Name</th>
            <th>PG Name</th>
            <th>Share Type</th>
            <th>User Phone Number</th>

          </tr>
        </thead>
                <tbody>

          {membersOut.map((m, index) => (
            <tr key={index}>
              <td>{m.name}</td>
              <td>{m.pgName}</td>
              <td>{m.shareType}</td>
              <td>{m.phone}</td>

            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <p>No members vacated today</p>
    )}
  </div>
      </section>

      {/* ================= BOOKINGS ================= */}
      <section className="bookings-section">
        {bookingsCount !== null ? (
          <>
            <p><b>Number of Bookings:</b> {bookingsCount}</p>
            <p><b>Amount Received:</b> ₹ {totalAmount}</p>

            {chartData && (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#5B5FF8"
                    fill="#5B5FF8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </>
        ) : (
          <p>Data needs to be fetched</p>
        )}
      </section>

      {/* ================= COMPLAINTS ================= */}
      <section className="complaints-section">
        <h4 className="section-title">Complaints</h4>
        {complaints ? (
          <div className="cards">
            {complaints.map((c) => (
              <div className="card" key={c.id}>
                <img src={userImg} alt="user" />
                <div>
                  <h5>{c.name}</h5>
                  <p>{c.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Data needs to be fetched</p>
        )}
      </section>

      {/* ================= REVIEWS ================= */}
      <section className="reviews-section">
        <h4 className="section-title">Reviews</h4>
        {reviews ? (
          <div className="cards">
            {reviews.map((r) => (
              <div className="card" key={r.id}>
                <img src={userImg} alt="user" />
                <div>
                  <h5>{r.name}</h5>
                  <p>{r.comment}</p>
                  <div className="stars">⭐ {r.rating}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>Data needs to be fetched</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
