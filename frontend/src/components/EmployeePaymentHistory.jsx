import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeePaymentHistory() {
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payments/history", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Payment History</h2>

      {history.length === 0 ? (
        <p>No payment history available.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Status</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {history.map(payment => (
              <tr key={payment._id}>
                <td>{payment.user?.email}</td>
                <td>R{payment.amount}</td>
                <td>{payment.description}</td>
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
