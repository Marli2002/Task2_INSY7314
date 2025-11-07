import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavBar from "./NavBar";
import './Form.css';
import './Page.css';

export default function CreateEmployee() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  // Sanitization functions
  const sanitizeUsername = (username) => {
    // Allow letters, numbers, underscores, 3-30 chars
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    const trimmed = username.trim();
    return usernameRegex.test(trimmed) ? trimmed : "";
  };

  const sanitizeEmail = (email) => {
    // Basic email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmed = email.trim().toLowerCase();
    return emailRegex.test(trimmed) ? trimmed : "";
  };

  const validatePassword = (password) => {
    // Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Sanitize and validate inputs
    const cleanUsername = sanitizeUsername(username);
    const cleanEmail = sanitizeEmail(email);

    if (!cleanUsername) {
      setError("Username must be 3-30 characters, letters, numbers, or underscores only.");
      setLoading(false);
      return;
    }

    if (!cleanEmail) {
      setError("Invalid email format.");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters and include: uppercase, lowercase, number, and special character (@$!%*?&).");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        'https://localhost:5000/api/admin/employees',
        {
          username: cleanUsername,
          email: cleanEmail,
          password: password
        },
        {
          headers: { 
            'x-auth-token': token 
          }
        }
      );

      alert("Employee created successfully!");
      navigate("/admin/employees");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create employee. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="full-page">
        <div className="form-container">
          <h2>Create New Employee</h2>
          <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9em' }}>
            Add a new employee account to the system
          </p>

          {error && <p className="error-msg">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="john_doe (3-30 characters)"
              required
            />
            <small style={{ color: '#666', fontSize: '0.85em', marginTop: '-8px', display: 'block' }}>
              Letters, numbers, and underscores only
            </small>

            <label style={{ marginTop: '1rem' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john.doe@company.com"
              required
            />

            <label style={{ marginTop: '1rem' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
            />
            <small style={{ color: '#666', fontSize: '0.85em', marginTop: '-8px', display: 'block' }}>
              Must include: 1 uppercase, 1 lowercase, 1 number, 1 special character (@$!%*?&)
            </small>

            <button 
              type="submit" 
              disabled={loading}
              style={{ marginTop: '1.5rem' }}
            >
              {loading ? "Creating..." : "Create Employee"}
            </button>
          </form>

          <button 
            className="secondary-btn" 
            onClick={() => navigate("/admin/employees")}
            style={{ marginTop: '1rem' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}



/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Regular expressions. Mozilla Developer Network. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

React. n.d. Forms – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react-dom/components/form

React. n.d. Using the Effect Hook – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react/hooks#effect-hooks
*/