import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Form.css';

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // added email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username,
        email,
        password
      });

      console.log("Registered:", response.data);
      alert("Registered successfully!");
      navigate("/login"); // redirect to login

    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("Registration failed. Please try again.");
      }
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
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Register</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/login")}>
          Back to Login
        </button>
      </div>
    </div>
  );
}
