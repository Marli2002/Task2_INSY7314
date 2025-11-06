// src/components/NavBar.jsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Nav.css';

export default function NavBar() {
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    setLoggedIn(!!token);
    setRole(savedRole);
  }, []);

  return (
    <header className="site-header">
      <div className="logo">MyPaymentsApp</div>
      <nav>
        {!loggedIn && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}

        {loggedIn && role === "User" && (
          <>
            <Link to="/payments/create" className="nav-link">Create Payment</Link>
            <Link to="/payments" className="nav-link">My Payments</Link>
          </>
        )}

        {loggedIn && role === "Employee" && (
          <>
            <Link to="/employee/pending" className="nav-link">Pending Approvals</Link>
            <Link to="/employee/history" className="nav-link">Payment History</Link>
          </>
        )}

        {loggedIn && (
          <Link to="/logout" className="nav-link logout">Logout</Link>
        )}
      </nav>
    </header>
  );
}
