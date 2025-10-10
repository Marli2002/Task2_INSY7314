import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { sanitizeEmail } from "../utils/sanitize";
import './Form.css';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Sanitize email
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
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: cleanEmail,
        password: cleanPassword
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Logged in successfully!");
      navigate("/payments/create");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="full-page">
      <div className="form-container">
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
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
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}


/*
References

Axios. n.d. Axios API documentation. Retrieved October 10, 2025, from https://axios-http.com/docs/api_intro

Mozilla Developer Network (MDN). n.d. Using the Web Storage API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API

Mozilla Developer Network (MDN). n.d. Using the Fetch API. Retrieved October 10, 2025, from https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

React. n.d. Components – React documentation. Retrieved October 10, 2025, from https://react.dev/reference/react-dom/components
*/
