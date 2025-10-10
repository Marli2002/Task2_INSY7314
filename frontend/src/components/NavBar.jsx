// src/components/NavBar.jsx
import { Link } from "react-router-dom";
import './Nav.css';

export default function NavBar() {
  return (
    <header className="site-header">
      <div className="logo">MyPaymentsApp</div>
      <nav>
        <Link to="/login" className="nav-link">Login</Link>
        <Link to="/register" className="nav-link">Register</Link>
        <Link to="/payments/create" className="nav-link">Create Payment</Link>
        <Link to="/payments" className="nav-link">Payments List</Link>
        <Link to="/logout" className="nav-link logout">Logout</Link>
      </nav>
    </header>
  );
}

/*
References

React Router. n.d. React Router documentation. Retrieved October 10, 2025, from https://reactrouter.com/start/framework/navigating

*/
