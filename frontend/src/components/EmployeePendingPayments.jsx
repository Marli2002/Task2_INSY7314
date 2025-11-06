import { useEffect, useState } from "react";
import axios from "axios";

export default function EmployeePendingPayments() {
  const [payments, setPayments] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payments/pending", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(response.data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    }
  };

  const handleApprove = async (paymentId) => {
    try {
      await axios.patch(`http://localhost:5000/api/payments/${paymentId}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingPayments(); // refresh list
    } catch (error) {
      console.error("Error approving:", error);
    }
  };

  const handleDeny = async (paymentId) => {
    try {
      await axios.patch(`http://localhost:5000/api/payments/${paymentId}/deny`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPendingPayments(); // refresh list
    } catch (error) {
      console.error("Error denying:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Pending Payments</h2>

      {payments.length === 0 ? (
        <p>No pending payments.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Submitted At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment._id}>
                <td>{payment.user?.email}</td>
                <td>R{payment.amount}</td>
                <td>{payment.description}</td>
                <td>{new Date(payment.createdAt).toLocaleString()}</td>
                <td>
                  <button onClick={() => handleApprove(payment._id)} className="approve-btn">Approve</button>
                  <button onClick={() => handleDeny(payment._id)} className="deny-btn">Deny</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
