import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      alert("Please enter email and password");
      return;
    }

    try {
      await api.post("login/", form);
      navigate("/redirect");
    } catch {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Login</h2>

        <div className="input-group">
          <label>Email Id</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        <p
          className="register-text"
          onClick={() => navigate("/register")}>
          Create a new account
        </p>

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}
