import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sanitizeInput, sanitizeAmount, sanitizePaymentMethod } from "../utils/sanitize";
import './Page.css';

export default function CreatePayment() {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanName = sanitizeInput(customerName);
    const cleanAmount = sanitizeAmount(amount);
    const cleanMethod = sanitizePaymentMethod(paymentMethod);

    if (!/^[a-zA-Z ]{2,50}$/.test(cleanName)) {
      setError("Customer name must be 2-50 letters only.");
      setLoading(false);
      return;
    }
    if (cleanAmount === null) {
      setError("Amount must be a number greater than 0 with max 2 decimals.");
      setLoading(false);
      return;
    }
    if (!cleanMethod) {
      setError("Invalid payment method.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in");
        navigate("/login");
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/payment`,
        { customerName: cleanName, amount: cleanAmount, paymentMethod: cleanMethod },
        { headers: { "x-auth-token": token } }
      );

      alert("Payment created successfully!");
      setCustomerName("");
      setAmount("");
      setPaymentMethod("card");
      navigate("/payments");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page full-page">
      <section className="content-section form-section">
        <h1>Create Payment</h1>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit} className="classic-form">
          <label>Customer Name</label>
          <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} required placeholder="John Doe" />

          <label>Amount (ZAR)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} required placeholder="100" min="0.01" step="0.01" />

          <label>Payment Method</label>
          <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)}>
            <option value="card">Card</option>
            <option value="bank">Bank</option>
            <option value="cash">Cash</option>
            <option value="paypal">PayPal</option>
          </select>

          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Payment"}</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/payments")}>View Payments</button>
      </section>
    </main>
  );
}
