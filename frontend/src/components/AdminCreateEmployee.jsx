import { useState } from "react";
import axios from "axios";

export default function AdminCreateEmployee() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/admin/employees`,
        { username, email, password },
        { headers: { "x-auth-token": token } }
      );

      setMessage(`Employee ${response.data.employee.username} created successfully!`);
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Failed to create employee.");
    }
  };

  return (
    <div className="page-container">
      <h2>Create Employee</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
}
