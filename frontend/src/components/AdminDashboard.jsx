import { useNavigate } from "react-router-dom";
import { hasRole } from "../utils/auth";

export default function AdminDashboard() {
  const navigate = useNavigate();

  if (!hasRole("admin")) return <h2>Access Denied</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Manage employees here:</p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => navigate("/admin/employees/create")}
          style={{ marginRight: 10 }}
        >
          ➕ Create Employee
        </button>

        <button
          onClick={() => navigate("/admin/employees")}
        >
          📋 View Employees
        </button>
      </div>
    </div>
  );
}
