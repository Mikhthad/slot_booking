import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./register.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    if (
      !form.first_name ||
      !form.last_name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirm_password
    ) {
      alert("All fields are required");
      return;
    }

    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("register/", {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });

      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="title">Sign Up</h2>

        <div className="form-box">
          <div className="row">
            <div className="input-group">
              <label>First Name</label>
              <input name="first_name" value={form.first_name} onChange={handleChange}/>
            </div>

            <div className="input-group">
              <label>Last Name</label>
              <input name="last_name" value={form.last_name} onChange={handleChange}/>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Email Id</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}/>
            </div>

            <div className="input-group">
              <label>Contact Number</label>
              <div className="phone-box">
                <span className="country-code">+91</span>
                <input name="phone" value={form.phone} onChange={handleChange}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}/>
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm_password" value={form.confirm_password} onChange={handleChange}/>
            </div>
          </div>
        </div>

        <p className="login-text"> 
            Already have an Account?{" "}
            <span onClick={() => navigate("/login")}>Login</span>
        </p>

        <button className="signup-btn" onClick={handleRegister}>
            Sign Up
        </button>
      </div>
    </div>
  );
}
