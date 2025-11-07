
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import './Nav.css';

export default function NavBar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
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

        {loggedIn && (
          <>
            <Link to="/payments/create" className="nav-link">Create Payment</Link>
            <Link to="/payments" className="nav-link">My Payments</Link>
            <Link to="/logout" className="nav-link logout">Logout</Link>
          </>
        )}
      </nav>
    </header>
  );
}
