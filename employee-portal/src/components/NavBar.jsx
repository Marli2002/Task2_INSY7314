
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Nav.css';

export default function NavBar() {
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    setLoggedIn(!!token);
    setRole(savedRole);
    setUsername(user.username || "");
  }, []);

  return (
    <header className="site-header">
      <div className="logo">
        {role === "Admin" ? "Admin Portal" : "Employee Portal"}
      </div>
      <nav>
        {!loggedIn && (
          <Link to="/login" className="nav-link">Login</Link>
        )}

        {loggedIn && role === "Employee" && (
          <>
            <Link to="/employee/pending" className="nav-link">Pending Payments</Link>
            <Link to="/employee/history" className="nav-link">Payment History</Link>
          </>
        )}

        {loggedIn && role === "Admin" && (
          <>
            <Link to="/admin/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/admin/employees" className="nav-link">Manage Employees</Link>
            <Link to="/admin/employees/create" className="nav-link">Create Employee</Link>
          </>
        )}

        {loggedIn && (
          <>
            <span className="nav-link" style={{ color: '#ccc', cursor: 'default' }}>
              {username}
            </span>
            <Link to="/logout" className="nav-link logout">Logout</Link>
          </>
        )}
      </nav>
    </header>
  );
}
