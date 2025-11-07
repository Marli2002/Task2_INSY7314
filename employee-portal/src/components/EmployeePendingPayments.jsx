import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Form.css";

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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/payments/pending`,
        { headers: { "x-auth-token": token } }
      );

      console.log("RESPONSE:", response.data);

      const sanitizedPayments = response.data.map((p) => ({
        _id: sanitizeString(p._id),
        customerName: sanitizeString(p.customerName),
        amount: Number(p.amount),
        paymentMethod: sanitizeString(p.paymentMethod),
        status: sanitizeString(p.status),
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

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/employee/payments/${id}/status`,
        { status },
        { headers: { "x-auth-token": token } }
      );

      setPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: response.data.status } : p))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update payment status.");
    }
  };

  return (
   
      <div className="page-content">
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p._id}>
                    <td>{p.customerName}</td>
                    <td>R {p.amount.toFixed(2)}</td>
                    <td>{p.paymentMethod}</td>
                    <td>{p.status}</td>
                    <td>
                      {p.status === "pending" ? (
                        <>
                          <button onClick={() => updateStatus(p._id, "approved")}>Approve</button>
                          <button onClick={() => updateStatus(p._id, "denied")}>Deny</button>
                        </>
                      ) : (
                        <span>Processed</span>
                      )}
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