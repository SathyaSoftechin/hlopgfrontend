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

  const [membersIn, setMembersIn] = useState(null);
  const [membersOut, setMembersOut] = useState(null);

  const [bookingsCount, setBookingsCount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);
  const [chartData, setChartData] = useState(null);

  const [complaints, setComplaints] = useState(null);
  const [reviews, setReviews] = useState(null);

  const [loadingPGs, setLoadingPGs] = useState(true);

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
        <div className="update-box">
          {pgUpdate ? <p>{pgUpdate}</p> : <p>Data needs to be fetched</p>}
        </div>
      </section>

      {/* ================= MEMBERS ================= */}
      <section className="members-lists">
        <div className="members-table">
          <h4 className="section-title">Members-in</h4>
          {membersIn ? (
            <table>
              <tbody>
                {membersIn.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.age}</td>
                    <td>{m.shareType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Data needs to be fetched</p>
          )}
        </div>

        <div className="members-table">
          <h4 className="section-title">Members-out</h4>
          {membersOut ? (
            <table>
              <tbody>
                {membersOut.map((m) => (
                  <tr key={m.id}>
                    <td>{m.name}</td>
                    <td>{m.age}</td>
                    <td>{m.shareType}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Data needs to be fetched</p>
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
