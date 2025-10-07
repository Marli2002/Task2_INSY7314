import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Page.css';

export default function CreatePayment() {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment created:", { recipient, amount });
    alert("Payment created successfully!");
    setRecipient("");
    setAmount("");
  };

  return (
    <main className="page">
      <section className="content-section">
        <h1>Create Payment</h1>
        <form onSubmit={handleSubmit} className="classic-form">
          <label>Recipient</label>
          <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} required />
          <label>Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <button type="submit">Create Payment</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/payments")}>View Payments</button>
      </section>
    </main>
  );
}
