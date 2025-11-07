import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  if (!hasRole("employee")) return <h2>Access Denied</h2>;

  return (
    <div style={{ padding: 20 }}>
      <NavBar />
      <h1>Employee Dashboard</h1>
      <p>Welcome! Here you can approve/deny payments and view history.</p>

      <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
        <button
          style={{ padding: '10px 20px', cursor: 'pointer' }}
          onClick={() => navigate("/employee/pending")}
        >
          Pending Payments
        </button>

        <button
          style={{ padding: '10px 20px', cursor: 'pointer' }}
          onClick={() => navigate("/employee/history")}
        >
          Payment History
        </button>
      </div>
    </div>
  );
}
