// src/pages/EditPG.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import "./EditPG.css";
import { useNavigate } from "react-router-dom";


const EditPG = () => {
  const { hostel_id } = useParams();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!hostel_id) return;

    const fetchPG = async () => {
      try {
        const res = await api.get(`/hostel/${hostel_id}`);
        if (res.data.ok && res.data.data) {
          setPgData(res.data.data);
          setMessage("");
        } else {
          setPgData(null);
          setMessage("PG not found");
        }
      } catch (err) {
        setPgData(null);
        setMessage("Failed to fetch PG details");
      } finally {
        setLoading(false);
      }
    };

    fetchPG();
  }, [hostel_id]);

  const handleChange = (e) => {
    setPgData({ ...pgData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await api.put(`/hostel/${hostel_id}`, pgData);
      setMessage("PG Details Updated Successfully!");
      navigate("/owner-dashboard")
    } catch (err) {
      setMessage("Failed to update PG details");
    }
  };

  if (loading) return <p>Loading PG details...</p>;
  if (!pgData) return <p>{message || "PG not found"}</p>;

  return (
    <div className="owner-dashboard-container">
 
      <main className="main-content">
        <div className="edit-pg-page">
          <h3>Edit PG Details</h3>

          <div className="form-group">
            <label>PG Name</label>
            <input
              type="text"
              name="hostel_name"
              value={pgData.hostel_name || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>PG Type</label>
            <input
              type="text"
              name="pg_type"
              value={pgData.pg_type || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="pgInfo"
              value={pgData.pgInfo || ""}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button onClick={handleSave}>Save Changes</button>
          {message && <p className="message">{message}</p>}
        </div>
      </main>
    </div>
  );
};

export default EditPG;
