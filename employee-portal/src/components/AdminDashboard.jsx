import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

export default function AdminDashboard() {
  const navigate = useNavigate();

  if (!hasRole("admin")) return <h2>Access Denied</h2>;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <NavBar />
      <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Admin Dashboard</h1>
        <p>Here the admin will manage employees.</p>

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
            onClick={() => navigate("/admin/employees/create")}
          >
            Create Employee
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
            onClick={() => navigate("/admin/employees")}
          >
            Employee List
          </button>
        </div>
      </div>
    </div>
  );
}