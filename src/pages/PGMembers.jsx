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
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  /* ---------------- Fetch Owner PGs ---------------- */
  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const res = await api.get("/owner/pgs", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const list = res.data?.data || [];
        setPgs(list);
        if (list.length) setSelectedPg(list[0].hostel_id);
      } catch {
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
        const res = await api.get(`/booking/pg/${selectedPg}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data?.members || []);
      } catch {
        setError("Failed to load members");
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [selectedPg, token]);

  /* ---------------- Update Payment Status (FIXED) ---------------- */
  const updatePaymentStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);

      // Optimistic UI
      setMembers((prev) =>
        prev.map((m) =>
          m.booking_id === bookingId
            ? { ...m, payment_status: newStatus }
            : m
        )
      );

      // ✅ MATCH BACKEND (PUT + payment_status)
      await api.put(
        `/booking/${bookingId}`,
        { payment_status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Payment update failed:", err?.response?.data || err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loadingPGs) return <p>Loading PGs…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pg-members-page">
      <h3>PG Members</h3>

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
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Sharing</th>
              <th>Joining Date</th>
              <th>Rent</th>
              <th>Payment Status</th>
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
                <td>
                  <select
                    disabled={updatingId === m.booking_id}
                    value={m.payment_status}
                    onChange={(e) =>
                      updatePaymentStatus(m.booking_id, e.target.value)
                    }
                  >
                    <option value="pending">Payment Pending</option>
                    <option value="success">Payment Successful</option>
                  </select>
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