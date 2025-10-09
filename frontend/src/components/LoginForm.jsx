import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';

export default function LoginForm() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email, password
      });

      console.log("Token received:", response.data.token);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      alert("Logged in successfully!");
      navigate("/payments/create");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please try again.");
    }
  };

  return (
    <div className="full-page">
      <div className="form-container">
        <h2>Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">Login</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
}
