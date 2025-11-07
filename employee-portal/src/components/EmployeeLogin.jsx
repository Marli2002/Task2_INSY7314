import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';


// Employee/Admin Login Form Component
export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Sanitize email
  const sanitizeEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const cleanEmail = email.trim();
    return emailRegex.test(cleanEmail) ? cleanEmail : "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Sanitize inputs
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = password.trim();

    if (!cleanEmail) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }
    if (!cleanPassword) {
      setError("Password cannot be empty.");
      setLoading(false);
      return;
    }

    try {
      // Login request with cookies
      const response = await axios.post(
        'https://localhost:5000/api/auth/login',
        { email: cleanEmail, password: cleanPassword },
        { withCredentials: true }
      );

      // Check if user is employee or admin
      const role = response.data.user.role;
      
      if (role !== "admin" && role !== "employee") {
        setError("Access denied. This portal is for employees and administrators only.");
        setLoading(false);
        return;
      }

      // Store JWT and user info in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("role", role);

      // Redirect based on role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "employee") {
        navigate("/employee/dashboard");
      }

      alert("Logged in successfully!");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page">
      <div className="form-container">
        <h2>Employee/Admin Login</h2>
        <p style={{ fontSize: '0.9em', color: '#666', marginBottom: '1rem' }}>
          This portal is for employees and administrators only.
        </p>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="employee@example.com"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.85em', color: '#999', textAlign: 'center' }}>
          No registration available. Contact your administrator for an account.
        </p>
      </div>
    </div>
  );
}



/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

Mozilla Developer Network (MDN). n.d. Regular expressions. Mozilla Developer Network. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

React. n.d. Components – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react-dom/components
*/