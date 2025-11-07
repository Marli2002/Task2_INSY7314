import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sanitizeUsername, sanitizeEmail, sanitizePassword } from "../utils/sanitize";
import './Form.css';

// Register Form Component
export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const cleanUsername = sanitizeUsername(username);
    const cleanEmail = sanitizeEmail(email);
    const cleanPassword = sanitizePassword(password);

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
    if (!cleanPassword) {
      setError("Password must be min 8 chars, include uppercase, lowercase, number, and special character.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword
      });

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

 return (

    <div className="full-page">
      <div className="form-container">
        <h2>Register</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}


/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

React. n.d. Forms – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react-dom/components/form

React. n.d. Using the Effect Hook – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react/hooks#effect-hooks
*/
  