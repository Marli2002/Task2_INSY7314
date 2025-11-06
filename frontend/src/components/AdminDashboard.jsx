import { hasRole } from "../utils/auth";

export default function AdminDashboard() {
  if (!hasRole("admin")) return <h2>Access Denied</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard</h1>
      <p>Here the admin will manage employees.</p>
    </div>
  );
}
