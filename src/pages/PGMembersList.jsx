import React, { useEffect, useState } from "react";
import api from "../api";

const PGMembersList = ({ user }) => {
  const ownerId = user?.owner_id;

  const [pgs, setPgs] = useState([]);
  const [selectedPg, setSelectedPg] = useState("");
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All"); // default filter

  // Fetch Owner PGs
  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        const res = await api.get(`/owner/pgs/${ownerId}`);
        const pgList = res.data.data || res.data;
        setPgs(pgList);

        if (pgList.length > 0) {
          setSelectedPg(pgList[0].hostel_id.toString());
        }
      } catch (err) {
        console.error("Error fetching PGs:", err);
        setError("Failed to load PGs");
      } finally {
        setLoading(false);
      }
    };
    if (ownerId) fetchOwnerPGs();
  }, [ownerId]);

  // Fetch PG members
  useEffect(() => {
    if (!selectedPg) return;

    const fetchMembers = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/booking/pg/${selectedPg}`);
        const allMembers = Array.isArray(res.data.members) ? res.data.members : [];
        setMembers(allMembers);
        setFilteredMembers(allMembers); // default: all
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Failed to load members");
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [selectedPg]);

  // Filter members whenever `filter` changes
  useEffect(() => {
    const now = new Date();
    let filtered = [...members];

    if (filter === "This Month") {
      filtered = members.filter((m) => {
        const joining = new Date(m.joiningDate);
        return joining.getMonth() === now.getMonth() && joining.getFullYear() === now.getFullYear();
      });
    } else if (filter === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      filtered = members.filter((m) => {
        const joining = new Date(m.joiningDate);
        return joining.getMonth() === lastMonth && joining.getFullYear() === year;
      });
    }

    setFilteredMembers(filtered);
  }, [filter, members]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pg-members-list-container">

      {/* PG Select Dropdown */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "600" }}>Select PG:</label>
        <select
          value={selectedPg}
          onChange={(e) => setSelectedPg(e.target.value)}
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc", minWidth: "200px" }}
        >
          {pgs.map((pg) => (
            <option key={pg.hostel_id} value={pg.hostel_id}>
              {pg.hostel_name}
            </option>
          ))}
        </select>
      </div>

      {/* Filter Dropdown */}
      <div style={{ marginBottom: "15px" }}>
        <label style={{ marginRight: "10px", fontWeight: "600" }}>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Members</option>
          <option value="This Month">This Month</option>
          <option value="Last Month">Last Month</option>
        </select>
      </div>

      {/* Selected PG Name */}
      <h2 style={{ marginBottom: "15px" }}>
        {pgs.find((p) => p.hostel_id === Number(selectedPg))?.hostel_name} — Members
      </h2>

      {/* Members Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", borderRadius: "8px", overflow: "hidden" }}>
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Sharing</th>
            <th style={thStyle}>Joining Date</th>
            <th style={thStyle}>Vacate Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No members found.
              </td>
            </tr>
          ) : (
            filteredMembers.map((m) => (
              <tr key={m.booking_id}>
                <td style={tdStyle}>{m.name}</td>
                <td style={tdStyle}>{m.sharing}</td>
                <td style={tdStyle}>{m.joiningDate}</td>
                <td style={tdStyle}>{m.vacateDate || "-"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { padding: "12px", borderBottom: "1px solid #ddd", textAlign: "left", fontWeight: "600" };
const tdStyle = { padding: "10px", borderBottom: "1px solid #eee" };

export default PGMembersList;
