import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeePaymentHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/payments/history`,
        {
          headers: { "x-auth-token": token }
        }
      );

      setHistory(response.data);
    } catch (err) {
      console.error("Error fetching payment history:", err);
      setError("Failed to load payment history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <h2>Payment History</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading payment history...</p>
      ) : history.length === 0 ? (
        <p>No approved or denied payments yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Updated</th>
            </tr>
          </thead>
          <tbody>
            {history.map((payment) => (
              <tr key={payment._id}>
                <td>{payment.customerName}</td>
                <td>R{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.status}</td>
                <td>{new Date(payment.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
