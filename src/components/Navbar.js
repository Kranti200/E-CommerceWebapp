import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState(""); // user role
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false); // toggle dropdown
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null); // id of category being edited
  const [editedCategoryName, setEditedCategoryName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const role = localStorage.getItem("userRole");
    if (name) setUserName(name);
    if (role) setUserRole(role);

    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:8080/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    alert("Logged out successfully!");
    navigate("/login");
  };

  const toggleCategories = () => setShowCategories((prev) => !prev);

  // Admin: Add Category
  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    axios
      .post("http://localhost:8080/categories", { category: newCategory })
      .then(() => {
        alert("Category added!");
        setNewCategory("");
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  // Admin: Delete Category
  const handleDeleteCategory = (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      axios
        .delete(`http://localhost:8080/categories/${id}`)
        .then(() => {
          alert("Category deleted!");
          fetchCategories();
        })
        .catch((err) => console.error(err));
    }
  };

  // Admin: Start editing a category
  const handleEditCategory = (id, currentName) => {
    setEditingCategoryId(id);
    setEditedCategoryName(currentName);
  };

  // Admin: Save updated category
  const handleUpdateCategory = (id) => {
    if (!editedCategoryName.trim()) return;
    axios
      .put(`http://localhost:8080/categories/${id}`, { category: editedCategoryName })
      .then(() => {
        alert("Category updated!");
        setEditingCategoryId(null);
        setEditedCategoryName("");
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">
          🛍️ {userName ? `Welcome, ${userName}` : "MyStore"}
        </span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/products">
                Products
              </Link>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <span
                className="nav-link dropdown-toggle"
                role="button"
                onClick={toggleCategories}
              >
                Categories
              </span>
              <ul
                className={`dropdown-menu ${showCategories ? "show" : ""}`}
                style={{ minWidth: "220px" }}
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <li
                      key={c.id}
                      className="d-flex justify-content-between align-items-center px-2"
                    >
                      {editingCategoryId === c.id ? (
                        <>
                          <input
                            type="text"
                            className="form-control form-control-sm me-1"
                            value={editedCategoryName}
                            onChange={(e) => setEditedCategoryName(e.target.value)}
                          />
                          <button
                            className="btn btn-sm btn-success me-1"
                            onClick={() => handleUpdateCategory(c.id)}
                          >
                            ✅
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setEditingCategoryId(null)}
                          >
                            ❌
                          </button>
                        </>
                      ) : (
                        <>
                          <span>{c.category}</span>
                          {userRole === "ADMIN" && (
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleEditCategory(c.id, c.category)}
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeleteCategory(c.id)}
                              >
                                ❌
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </li>
                  ))
                ) : (
                  <li>
                    <span className="dropdown-item">No categories</span>
                  </li>
                )}

                {/* Admin: Add new category */}
                {userRole === "ADMIN" && (
                  <li className="px-2 mt-2">
                    <input
                      type="text"
                      className="form-control form-control-sm mb-1"
                      placeholder="New category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button
                      className="btn btn-sm btn-success w-100"
                      onClick={handleAddCategory}
                    >
                      ➕ Add
                    </button>
                  </li>
                )}
              </ul>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/cart">
                Cart
              </Link>
            </li>
          </ul>

          <button
            onClick={handleLogout}
            className="btn btn-outline-light btn-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
