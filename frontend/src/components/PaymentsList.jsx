import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to access this page.");
      navigate("/login");
    } else {
      fetchPayments();
    }
  }, [navigate]);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/payments`, {
        headers: { "x-auth-token": token }
      });
      setPayments(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="page full-page">
      <section className="content-section">
        <h1>My Payments</h1>
        {payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <ul>
            {payments.map(p => (
              <li key={p._id}>
                {p.customerName} — {p.amount} ZAR — {p.paymentMethod} — {new Date(p.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
