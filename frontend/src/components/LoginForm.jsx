import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Form.css';

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", { username, password });
    alert("Logged in successfully!");
    navigate("/payments/create"); // redirect after login
  };

  return (
    <div className="full-page">
      <div className="form-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button className="secondary-btn" onClick={() => navigate("/register")}>
          Register
        </button>
      </div>
    </div>
  );
}
