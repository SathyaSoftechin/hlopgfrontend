import React, { useEffect, useState } from "react";
import api from "../api";
import "./PGMembersList.css";

const PGMembersList = () => {
  const token = localStorage.getItem("hlopgToken");

  const [pgs, setPgs] = useState([]);
  const [selectedPg, setSelectedPg] = useState(null);

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  const [pgLoading, setPgLoading] = useState(true);
  const [memberLoading, setMemberLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  /* ---------------- Fetch Owner PGs ---------------- */
  useEffect(() => {
    const fetchOwnerPGs = async () => {
      try {
        setPgLoading(true);

        const res = await api.get("/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data?.data || [];
        setPgs(list);

        if (list.length > 0) {
          setSelectedPg(list[0].hostel_id); // ✅ number
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load PGs");
      } finally {
        setPgLoading(false);
      }
    };

    fetchOwnerPGs();
  }, [token]);

  /* ---------------- Fetch Members ---------------- */
  useEffect(() => {
    if (!selectedPg) return;

    const fetchMembers = async () => {
      try {
        setMemberLoading(true);
        setError("");

        const res = await api.get(`/booking/pg/${selectedPg}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookings = res.data?.members || [];

        const mapped = bookings.map((b) => ({
          booking_id: b.booking_id,
          name: b.name || "—",
          phone: b.phone || "—",
          sharing: b.sharing,
          joiningDate: b.joiningDate,
          vacateDate: b.vacateDate,
          rentAmount: b.rentAmount ?? 0,
          status: b.status,
        }));

        setMembers(mapped);
        setFilteredMembers(mapped);
      } catch (err) {
        console.error(err);
        setError("Failed to load members");
      } finally {
        setMemberLoading(false);
      }
    };

    fetchMembers();
  }, [selectedPg, token]);

  /* ---------------- Filters ---------------- */
  useEffect(() => {
    const now = new Date();
    let result = [...members];

    if (filter === "This Month") {
      result = members.filter((m) => {
        const d = new Date(m.joiningDate);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      });
    }

    if (filter === "Last Month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      result = members.filter((m) => {
        const d = new Date(m.joiningDate);
        return d.getMonth() === lastMonth && d.getFullYear() === year;
      });
    }

    setFilteredMembers(result);
  }, [filter, members]);

  /* ---------------- UI ---------------- */
  if (pgLoading) return <p>Loading PGs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pg-members-list-container">
      <h3>PG Members List</h3>

      {/* PG Select */}
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

      {/* Filter */}
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All Members</option>
        <option value="This Month">This Month</option>
        <option value="Last Month">Last Month</option>
      </select>

      {memberLoading ? (
        <p>Loading Members…</p>
      ) : filteredMembers.length === 0 ? (
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
              <th>Vacate Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.map((m) => (
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
                <td>
                  {m.vacateDate
                    ? new Date(m.vacateDate).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PGMembersList;
