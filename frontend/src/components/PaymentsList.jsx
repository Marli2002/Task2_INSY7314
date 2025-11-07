import { useEffect, useState } from "react";  
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';

// Helper to sanitize strings
const sanitizeString = (str) => {
  if (typeof str === "string") {
    return str.replace(/[$.]/g, "").trim();
  }
  return str;
};

// Payments List Component
export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch payments on component mount
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

        // Sanitize all data from backend
        const sanitizedPayments = response.data.map(p => ({
          _id: sanitizeString(p._id),
          customerName: sanitizeString(p.customerName),
          amount: Number(p.amount), // assume backend always sends a number
          paymentMethod: sanitizeString(p.paymentMethod),
          status: sanitizeString(p.status),
        }));

        setPayments(sanitizedPayments);

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
                <th>Amount (R)</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.customerName}</td>
                 <td>{`R ${p.amount.toFixed(2)}`}</td>
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

/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

React. n.d. Using the Effect Hook – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react/hooks#effect-hooks

React. n.d. Lists and Keys – React documentation. Retrieved October 10, 2025, from https://react.dev/learn/rendering-lists
*/