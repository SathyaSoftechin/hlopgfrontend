import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api, { BASE_URL } from "../api";
import "./MyPGs.css";

import pgDefaultImg from "../assets/pg1.png";

const MyPGs = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const token = localStorage.getItem("hlopgToken");
        if (!token) throw new Error("Token missing");

        const res = await api.get("/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPgs(res.data.data || []);
      } catch (err) {
        console.error("Error fetching PGs:", err);
        setError("Failed to load PGs");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerPGs();
  }, []);

  const handleAction = (hostel_id, action) => {
    switch (action) {
      case "editPG":
        navigate(`/edit-pg/${hostel_id}`);
        break;

      case "viewMembers":
        navigate(`/pg-members/${hostel_id}`);
        break;

      default:
        break;
    }
  };

  if (loading) return <p>Loading PGs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="my-pgs-page">
      <h3>My PGs</h3>

      {pgs.length === 0 ? (
        <p>No PGs found</p>
      ) : (
        <div className="pgs-grid">
          {pgs.map((pg) => (
            <div className="pg-card" key={pg.hostel_id}>
             <img
  src={
    pg.images && pg.images.length > 0
      ? `${BASE_URL}${pg.images[0]}`
      : pgDefaultImg
  }
  alt={pg.hostel_name}
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = pgDefaultImg;
  }}
/>
              <h4>{pg.hostel_name}</h4>

              <div className="pg-actions">
                <button
                  onClick={() =>
                    handleAction(pg.hostel_id, "viewMembers")
                  }
                >
                  View PG Members
                </button>

                <button
                  onClick={() =>
                    handleAction(pg.hostel_id, "editPG")
                  }
                >
                  Edit PG Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPGs;
