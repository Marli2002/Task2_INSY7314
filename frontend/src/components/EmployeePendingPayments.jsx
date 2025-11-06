import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";   // ✅ ADD THIS
import axios from "axios";

export default function EmployeePendingPayments() {
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // ✅ ADD THIS

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    setError("");
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/employee/payments/pending`,
        {
          headers: { "x-auth-token": token }
        }
      );
      setPending(response.data);
    } catch (error) {
      console.error("Error fetching pending payments:", error);
      setError("Failed to load pending payments.");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/employee/payments/${id}/status`,
        { status: newStatus },
        {
          headers: { "x-auth-token": token }
        }
      );
      fetchPending();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  return (
    <div className="page-container">
      <h2>Pending Payments</h2>

      {/* ✅ NEW BUTTON HERE */}
      <button
  className="secondary-btn"
  style={{ marginBottom: "15px" }}
  onClick={() => navigate("/employee/history")} // <-- updated
>
  View Payment History
</button>


      {error && <p style={{ color: "red" }}>{error}</p>}

      {pending.length === 0 ? (
        <p>No payments waiting for approval.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pending.map(payment => (
              <tr key={payment._id}>
                <td>{payment.customerName}</td>
                <td>R{payment.amount}</td>
                <td>{payment.paymentMethod}</td>
                <td>{payment.status}</td>
                <td>
                  <button onClick={() => updateStatus(payment._id, "approved")}>
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => updateStatus(payment._id, "denied")}
                    style={{ marginLeft: "8px" }}
                  >
                    ❌ Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
