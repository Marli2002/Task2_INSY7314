import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import './Form.css';

const sanitizeString = (str) => typeof str === "string" ? str.replace(/[$.]/g, "").trim() : str;

export default function EmployeePaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      setError("");
      setLoading(true);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/payment/history`,
          {
            headers: { "x-auth-token": token }
          }
        );

        const sanitizedPayments = response.data.map(p => ({
          _id: sanitizeString(p._id),
          customerName: sanitizeString(p.customerName),
          amount: Number(p.amount),
          paymentMethod: sanitizeString(p.paymentMethod),
          status: sanitizeString(p.status),
          updatedAt: new Date(p.updatedAt).toLocaleString(),
          user: p.userId ? { email: p.userId.email, username: p.userId.username } : null
        }));

        setPayments(sanitizedPayments);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to fetch payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, [navigate]);

  return (
    <>
      <NavBar />
      <div className="page-content">
        <div className="payments-container">
          <h2>Payment History</h2>
          {error && <p className="error-msg">{error}</p>}

          {loading ? (
            <p>Loading payment history...</p>
          ) : payments.length === 0 ? (
            <p>No approved or denied payments found.</p>
          ) : (
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Amount (R)</th>
                  <th>Payment Method</th>
                  <th>Status</th>
                  <th>Updated At</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.customerName}</td>
                    <td>{`R ${p.amount.toFixed(2)}`}</td>
                    <td>{p.paymentMethod}</td>
                    <td>{p.status}</td>
                    <td>{p.updatedAt}</td>
                    <td>{p.user ? `${p.user.username} (${p.user.email})` : "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}