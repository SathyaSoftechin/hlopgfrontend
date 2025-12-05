// src/pages/PaymentsList.jsx
import React, { useState } from "react";
import "./PaymentsList.css";

const PaymentsList = () => {
  // Initial payments data
  const [payments, setPayments] = useState([
    {
      id: 1,
      name: "Thota Chaitanya",
      date: "2025-10-10",
      type: "3 Sharing",
      amount: "9000",
      status: "Paid",
    },
    {
      id: 2,
      name: "Vijay Kumar",
      date: "2025-10-12",
      type: "2 Sharing",
      amount: "8500",
      status: "Pending",
    },
    {
      id: 3,
      name: "Rohit Reddy",
      date: "2025-10-15",
      type: "Single Room",
      amount: "12000",
      status: "Paid",
    },
  ]);

  // New Payment form state
  const [newPayment, setNewPayment] = useState({
    name: "",
    date: "",
    type: "",
    amount: "",
    status: "Pending",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPayment((prev) => ({ ...prev, [name]: value }));
  };

  // Add new payment
  const handleAddPayment = () => {
    if (
      !newPayment.name ||
      !newPayment.date ||
      !newPayment.type ||
      !newPayment.amount
    ) {
      alert("Please fill all fields before adding a payment!");
      return;
    }

    const newEntry = {
      ...newPayment,
      id: payments.length + 1,
    };
    setPayments([...payments, newEntry]);
    setNewPayment({
      name: "",
      date: "",
      type: "",
      amount: "",
      status: "Pending",
    });
  };

  // Toggle payment status between Pending and Paid
  const handleToggleStatus = (id) => {
    const updatedPayments = payments.map((p) =>
      p.id === id
        ? { ...p, status: p.status === "Paid" ? "Pending" : "Paid" }
        : p
    );
    setPayments(updatedPayments);
  };

  return (
    <div className="payments-container">
      <div className="payments-header">
        <h2>💳 Payments List</h2>
      </div>

      {/* ---------------- Add Payment Form ---------------- */}
      <div className="add-payment-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={newPayment.name}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={newPayment.date}
          onChange={handleChange}
        />
        <select name="type" value={newPayment.type} onChange={handleChange}>
          <option value="">Select Sharing Type</option>
          <option value="Single Room">Single Room</option>
          <option value="2 Sharing">2 Sharing</option>
          <option value="3 Sharing">3 Sharing</option>
          <option value="4 Sharing">4 Sharing</option>
        </select>
        <input
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={newPayment.amount}
          onChange={handleChange}
        />
        <button onClick={handleAddPayment}>+ Add Payment</button>
      </div>

      {/* ---------------- Payments Table ---------------- */}
      <table className="payments-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Joining Date</th>
            <th>Sharing Type</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.name}</td>
              <td>{payment.date}</td>
              <td>{payment.type}</td>
              <td>₹ {payment.amount}</td>
              <td>
                <span
                  className={`status-badge ${
                    payment.status.toLowerCase() === "paid"
                      ? "paid"
                      : "pending"
                  }`}
                >
                  {payment.status}
                </span>
              </td>
              <td>
                <button
                  className={`status-toggle-btn ${
                    payment.status === "Paid" ? "btn-paid" : "btn-pending"
                  }`}
                  onClick={() => handleToggleStatus(payment.id)}
                >
                  {payment.status === "Paid" ? "Mark Pending" : "Mark Paid"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------- Total Footer ---------------- */}
      <div className="flex justify-end mt-6">
        <div className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium text-lg inline-block">
          Total: ₹{" "}
          {payments
            .reduce((sum, p) => sum + parseInt(p.amount || 0), 0)
            .toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default PaymentsList;
