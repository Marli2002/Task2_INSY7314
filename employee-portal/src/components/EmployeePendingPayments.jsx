import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import './Form.css';

const sanitizeString = (str) => (typeof str === "string" ? str.replace(/[$.]/g, "").trim() : "");

export default function EmployeePendingPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/payment/pending-all`, {
        headers: { "x-auth-token": token }
      });

      const sanitizedPayments = response.data.map(p => ({
        _id: sanitizeString(p._id),
        customerName: sanitizeString(p.customerName),
        amount: Number(p.amount),
        paymentMethod: sanitizeString(p.paymentMethod),
        status: sanitizeString(p.status),
        user: p.userId ? { email: p.userId.email, username: p.userId.username } : null
      }));

      setPayments(sanitizedPayments);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pending payments.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/payment/${id}/status`,
        { status },
        { headers: { "x-auth-token": token } }
      );

      // Update the specific payment in state
      setPayments(payments.map(p => p._id === id ? { ...p, status: response.data.status } : p));
    } catch (err) {
      console.error(err);
      setError("Failed to update payment status.");
    }
  };

  return (
    <div className="full-page">
      <NavBar />
      <div className="payments-container">
        <h2>Pending Payments</h2>
        {error && <p className="error-msg">{error}</p>}

        {loading ? (
          <p>Loading pending payments...</p>
        ) : payments.length === 0 ? (
          <p>No pending payments found.</p>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Amount (R)</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>{p.customerName}</td>
                  <td>{`R ${p.amount.toFixed(2)}`}</td>
                  <td>{p.paymentMethod}</td>
                  <td>{p.status}</td>
                  <td>{p.user ? `${p.user.username} (${p.user.email})` : "N/A"}</td>
                  <td>
                    {p.status === "pending" && (
                      <>
                        <button onClick={() => updateStatus(p._id, "approved")}>Approve</button>
                        <button onClick={() => updateStatus(p._id, "denied")}>Deny</button>
                      </>
                    )}
                    {p.status !== "pending" && <span>Processed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
