import React, { useEffect, useState } from "react";
import api from "../api";
import "./PGMembers.css";

const PGMembers = () => {
  const token = localStorage.getItem("hlopgToken");

  const [pgs, setPgs] = useState([]);
  const [selectedPg, setSelectedPg] = useState(null);

  const [members, setMembers] = useState([]);
  const [loadingPGs, setLoadingPGs] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- Fetch Owner PGs ---------------- */
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        setLoadingPGs(true);

        const res = await api.get("/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data?.data || [];
        setPgs(list);

        if (list.length > 0) {
          setSelectedPg(list[0].hostel_id); // ✅ NUMBER
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load PGs");
      } finally {
        setLoadingPGs(false);
      }
    };

    fetchPGs();
  }, [token]);

  /* ---------------- Fetch Members ---------------- */
  useEffect(() => {
    if (!selectedPg) return;

    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        setError("");

        const res = await api.get(`/booking/pg/${selectedPg}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMembers(res.data?.members || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [selectedPg, token]);

  /* ---------------- UI ---------------- */
  if (loadingPGs) return <p>Loading PGs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pg-members-page">
      <h3>PG Members</h3>

      {/* PG Selector */}
      <select
        value={selectedPg ?? ""}
        onChange={(e) => setSelectedPg(Number(e.target.value))}
      >
        {pgs.map((pg) => (
          <option key={pg.hostel_id} value={pg.hostel_id}>
            {pg.hostel_name}
          </option>
        ))}
      </select>

      {loadingMembers ? (
        <p>Loading members…</p>
      ) : members.length === 0 ? (
        <p>No members found</p>
      ) : (
        <table width="100%">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Sharing</th>
              <th>Joining Date</th>
              <th>Rent</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.booking_id}>
                <td>{m.name}</td>
                <td>{m.phone}</td>
                <td>{m.sharing}</td>
                <td>
                  {m.joiningDate
                    ? new Date(m.joiningDate).toLocaleDateString()
                    : "-"}
                </td>
                <td>₹{m.rentAmount}</td>
                <td
                  style={{
                    color:
                      m.status === "pending_payment" ? "red" : "green",
                    fontWeight: 600,
                  }}
                >
                  {m.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PGMembers;
