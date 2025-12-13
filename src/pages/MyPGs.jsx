import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./MyPGs.css";

import pgDefaultImg from "../assets/pg1.png";

const MyPGs = ({ user }) => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const ownerId = user?.owner_id;

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

    if (ownerId) fetchOwnerPGs();
  }, [ownerId]);

  const handleAction = (hostel_id, action) => {
    switch (action) {
      case "editPG":
        navigate(`/edit-pg/${hostel_id}`);
        break;
      case "editRooms":
        navigate(`/edit-rooms/${hostel_id}`);
        break;
      case "viewMembers":
        // navigate(`/pg-members/${hostel_id}`);
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
              <img src={pg.image || pgDefaultImg} alt={pg.hostel_name} />
              <h4>{pg.hostel_name}</h4>
              <div className="pg-actions">
                <button onClick={() => handleAction(pg.hostel_id, "editPG")}>
                  View Room's
                </button>
                <button onClick={() => handleAction(pg.hostel_id, "editRooms")}>
                  Edit PG Details
                </button>
                {/* <button onClick={() => handleAction(pg.hostel_id, "viewMembers")}>
                  View PG Members
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPGs;
