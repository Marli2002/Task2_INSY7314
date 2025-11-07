import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

export default function AdminDashboard() {
  const navigate = useNavigate();

  if (!hasRole("admin")) return <h2>Access Denied</h2>;

  return (
    <div style={{ width: '100%', minHeight: '100vh' }}>
      <NavBar />
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
        <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>Admin Dashboard</h1>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem' }}>Here the admin will manage employees.</p>

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
            onClick={() => navigate("/admin/employees/create")}
          >
            Create Employee
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
            onClick={() => navigate("/admin/employees")}
          >
            Employee List
          </button>
        </div>
      </div>
    </div>
  );
}