import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Step 1: Login (make sure endpoint matches backend)
      const res = await axios.post("http://localhost:8080/api/user/Login", form);

      // Check if backend sends 200 or has a token / message
      if (res.status === 200) {
  const userRes = await axios.get(
    `http://localhost:8080/api/user/email/${form.email}`
  );

  const { name, role } = userRes.data; // ✅ get role also
  localStorage.setItem("userName", name);
  localStorage.setItem("userRole", role); // ✅ save role

  alert("Login Successful!");
  navigate("/products");
} else {
        alert("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error.response || error);
      if (error.response?.status === 401) {
        alert("Invalid credentials. Please check your email or password.");
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button className="btn btn-success w-100">Login</button>
        </form>

        <p className="text-center mt-3">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary fw-bold">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
