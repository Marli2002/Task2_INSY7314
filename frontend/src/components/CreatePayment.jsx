import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Page.css';

export default function CreatePayment() {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment`,
        { customerName, amount, paymentMethod },
        { headers: { "x-auth-token": token } }
      );

      console.log("Payment created:", response.data);
      alert("Payment created successfully!");
      // reset form
      setCustomerName("");
      setAmount("");
      setPaymentMethod("card");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create payment");
    }
  };

  return (
    <main className="page">
      <section className="content-section">
        <h1>Create Payment</h1>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="classic-form">
          <label>Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <label>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="card">Card</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="paypal">PayPal</option>
          </select>
          <button type="submit">Create Payment</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/payments")}>
          View Payments
        </button>
      </section>
    </main>
  );
}
