import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  if (!hasRole("employee")) return <h2>Access Denied</h2>;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Employee Dashboard</h1>
        <p>Welcome! Here you can approve/deny payments and view history.</p>

        <div style={{ marginTop: 20, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer',
              backgroundColor: '#004466',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
            onClick={() => navigate("/employee/pending")}
          >
            Pending Payments
          </button>

          <button
            style={{ 
              padding: '10px 20px', 
              cursor: 'pointer',
              backgroundColor: '#004466',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold'
            }}
            onClick={() => navigate("/employee/history")}
          >
            Payment History
          </button>
        </div>
      </div>
    </div>
  );
}