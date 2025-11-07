import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  if (!hasRole("employee")) return <h2>Access Denied</h2>;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
     
      <div style={{ 
        padding: '40px 20px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)'
      }}>
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Employee Dashboard</h1>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>Welcome! Here you can approve/deny payments and view history.</p>

        <div style={{ 
          marginTop: 20, 
          display: 'flex', 
          gap: '15px', 
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            style={{ 
              padding: '15px 30px', 
              cursor: 'pointer',
              backgroundColor: '#004466',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
            }}
            onClick={() => navigate("/employee/pending")}
          >
            Pending Payments
          </button>

          <button
            style={{ 
              padding: '15px 30px', 
              cursor: 'pointer',
              backgroundColor: '#004466',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '1.1rem'
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