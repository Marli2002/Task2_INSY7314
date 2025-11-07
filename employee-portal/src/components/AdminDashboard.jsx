import { hasRole } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import NavBar from './NavBar';

export default function AdminDashboard() {
  const navigate = useNavigate();

  if (!hasRole("admin")) return <h2>Access Denied</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Here the admin will manage employees.</p>

      <div style={{ marginTop: 20, display: 'flex', gap: '10px' }}>
        <button
          style={{ padding: '10px 20px', cursor: 'pointer' }}
          onClick={() => navigate("/admin/employees/create")}
        >
          Create Employee
        </button>

        <button
          style={{ padding: '10px 20px', cursor: 'pointer' }}
          onClick={() => navigate("/admin/employees")}
        >
          Employee List
        </button>
      </div>
    </div>
  );
}
