import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/user/Signup", form);

      // ✅ Save user details in localStorage
      localStorage.setItem("userName", form.name);
      localStorage.setItem("userRole", form.role);

      alert("Signup Successful!");
      navigate("/products"); // redirect to products page
    } catch (error) {
      console.error(error);
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="col-md-6 offset-md-3 mt-5">
      <div className="card p-4 shadow-sm">
        <h2 className="text-center mb-4">Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-3"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />

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

          {/* ✅ Role Selection Dropdown */}
          <select
            className="form-select mb-3"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <button className="btn btn-primary w-100">Signup</button>
        </form>

        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-bold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
