import React, { useState } from "react";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import { logoutUser } from "./api/auth";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [showLogin, setShowLogin] = useState(true);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      alert("Logged out successfully!");
    } catch {
      alert("Logout failed");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="App">
        <h1>Welcome!</h1>
        <p>You are logged in.</p>
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div className="App">
      <h1>Authentication Demo</h1>

      <div className="toggle-buttons">
        <button
          className={!showLogin ? "" : "active"}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          className={showLogin ? "" : "active"}
          onClick={() => setShowLogin(false)}
        >
          Register
        </button>
      </div>

      {showLogin ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

export default App;
