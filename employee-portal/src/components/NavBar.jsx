
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import './Nav.css';

export default function NavBar() {
  const [role, setRole] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");

    setLoggedIn(!!token);
    setRole(savedRole);
  }, [location]); // re-check role on route change

  return (
    <header className="site-header">
      <div className="logo">MyPaymentsApp</div>
      <nav>
        {/* Always show Login/Logout on login page */}
        {location.pathname === "/login" && (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            {loggedIn && <Link to="/logout" className="nav-link logout">Logout</Link>}
          </>
        )}

        {/* Employee Links */}
        {loggedIn && role === "employee" && location.pathname !== "/login" && (
          <>
            <Link to="/employee/dashboard" className="nav-link">Employee Dashboard</Link>
            <Link to="/employee/pending" className="nav-link">Pending Approvals</Link>
            <Link to="/employee/history" className="nav-link">Payment History</Link>
            <Link to="/logout" className="nav-link logout">Logout</Link>
          </>
        )}

        {/* Admin Links */}
        {loggedIn && role === "admin" && location.pathname !== "/login" && (
          <>
            <Link to="/admin/dashboard" className="nav-link">Admin Dashboard</Link>
            <Link to="/admin/employees" className="nav-link">Employee List</Link>
            <Link to="/admin/employees/create" className="nav-link">Create Employee</Link>
            <Link to="/logout" className="nav-link logout">Logout</Link>
          </>
        )}
      </nav>
    </header>
  );
}
