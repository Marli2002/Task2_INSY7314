import { useEffect, useState } from "react";  
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      setError("");
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payment`,
          {
            headers: { "x-auth-token": token }
          }
        );

        setPayments(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch payments. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [navigate]);

  return (
    <div className="full-page">
      <div className="payments-container">
        <h2>Existing Payments</h2>
        {error && <p className="error-msg">{error}</p>}
        {loading ? (
          <p>Loading payments...</p>
        ) : payments.length === 0 ? (
          <p>No payments found.</p>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Amount ($)</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.customerName}</td>
                  <td>{p.amount.toFixed(2)}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="secondary-btn" onClick={() => navigate("/payments/create")}>
          Create Payment
        </button>
      </div>
    </div>
  );
}
