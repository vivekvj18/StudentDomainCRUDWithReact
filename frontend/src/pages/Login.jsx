import { useState } from "react";
import "../styles/App.css"; // Import your CSS

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authString = btoa(email + ":" + password);

    try {
      const response = await fetch("http://localhost:8080/api/domains", {
        headers: { Authorization: "Basic " + authString },
      });

      if (response.ok) {
        // Save to storage
        sessionStorage.setItem("authToken", authString);
        sessionStorage.setItem("authEmail", email);
        // Tell App.jsx that we are logged in
        onLogin(); 
      } else {
        setError("Invalid Credentials!");
      }
    } catch (err) {
      setError("Server Error. Is Backend running?");
    }
  };

  return (
    <div className="login-body">
      <div className="login-container glass-panel">
        <h2>👋 Welcome Back</h2>
        <p>Login to access Admin Dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>

        {error && <p className="error-message" style={{ display: "block" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;