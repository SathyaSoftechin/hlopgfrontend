// src/pages/PaymentsList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import "./PaymentsList.css";

const PaymentsList = () => {
  const token = localStorage.getItem("hlopgToken");

  const [payments, setPayments] = useState(null); // 🔑 null = not fetched
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PAYMENTS ================= */
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/payments/owner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPayments(res.data?.data || []);
      } catch (err) {
        console.warn("Payments API not ready yet");
        setPayments(null); // 🔑 keep UI alive
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [token]);

  /* ================= UPDATE PAYMENT STATUS ================= */
  const togglePaymentStatus = async (paymentId, currentStatus) => {
    try {
      const newStatus = currentStatus === "paid" ? "pending" : "paid";

      await api.put(
        `/payments/${paymentId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // 🔥 Instant UI update (optimistic update)
      setPayments((prev) =>
        prev.map((p) =>
          p.payment_id === paymentId
            ? { ...p, status: newStatus }
            : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update payment status. Please try again.");
    }
  };

  /* ================= TOTAL ================= */
  const totalAmount =
    payments?.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0
    ) || 0;

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>💳 Payments List</h2>
      </div>

      {/* Loading */}
      {loading && <p>Loading payments…</p>}

      {/* API Not Ready */}
      {!loading && payments === null && (
        <p>Data needs to be fetched</p>
      )}

      {/* No Payments */}
      {!loading && payments?.length === 0 && (
        <p>No payments found</p>
      )}

      {/* Payments Table */}
      {!loading && payments?.length > 0 && (
        <>
          <table className="payments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Sharing</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.payment_id}>
                  <td>{p.name || "-"}</td>
                  <td>
                    {p.payment_date
                      ? new Date(p.payment_date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{p.sharing_type || "-"}</td>
                  <td>₹ {Number(p.amount || 0).toLocaleString()}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        p.status === "paid" ? "paid" : "pending"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`status-toggle-btn ${
                        p.status === "paid"
                          ? "btn-paid"
                          : "btn-pending"
                      }`}
                      onClick={() =>
                        togglePaymentStatus(p.payment_id, p.status)
                      }
                    >
                      {p.status === "paid"
                        ? "Mark Pending"
                        : "Mark Paid"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* TOTAL */}
          <div className="payments-total">
            Total: ₹ {totalAmount.toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
};

export default PaymentsList;
