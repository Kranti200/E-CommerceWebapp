import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // ✅ category state
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    image: "",
    category: { id: "" },
  });

  const API_URL = "http://localhost:8080";
  const userRole = localStorage.getItem("userRole"); // "ADMIN" or "USER"

  // ✅ Fetch all categories from backend
  useEffect(() => {
    axios
      .get(`${API_URL}/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // ✅ Fetch all products (or search)
  useEffect(() => {
    let url = `${API_URL}/product`;
    if (search.trim() !== "") {
      url = `${API_URL}/product/search?keyword=${search}`;
    }
    axios
      .get(url)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, [search, refresh]);

  // ✅ Open Add Modal
  const handleShowAdd = () => {
    setCurrentProduct(null);
    setForm({ name: "", price: 0, image: "", category: { id: "" } });
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleShowEdit = (product) => {
    setCurrentProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category ? { id: product.category.id } : { id: "" },
    });
    setShowModal(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => setShowModal(false);

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ Add or Update Product
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentProduct) {
        await axios.put(`${API_URL}/product/update/${currentProduct.p_id}`, form);
        alert("✅ Product updated successfully!");
      } else {
        await axios.post(`${API_URL}/product/addProduct`, form);
        alert("✅ Product added successfully!");
      }
      setShowModal(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("❌ Operation failed. Try again.");
    }
  };

  // ✅ Delete Product
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      axios
        .delete(`${API_URL}/product/${id}`)
        .then(() => {
          alert("🗑️ Product deleted!");
          setRefresh(!refresh);
        })
        .catch((err) => console.error(err));
    }
  };

  // ✅ Add to Cart (for Users)
  const handleAddToCart = (product) => {
    const cartItem = { product, quantity: 1, user: { id: 1 } };
    axios
      .post(`${API_URL}/cart/add`, cartItem)
      .then(() => alert("🛒 Added to cart"))
      .catch((err) => console.error(err));
  };

  const handleBuyNow = (product) => {
    alert(`💳 Buying ${product.name} now!`);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">🛍️ Product List</h2>

      {/* ✅ Search & Add */}
      <div className="mb-3 d-flex justify-content-between">
        <input
          type="text"
          placeholder="Search products..."
          className="form-control me-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {userRole === "ADMIN" && (
          <button className="btn btn-success" onClick={handleShowAdd}>
            ➕ Add Product
          </button>
        )}
      </div>

      {/* ✅ Product Cards */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="col-12 col-sm-6 col-md-4 mb-3" key={product.p_id}>
               <div className="card h-100 shadow-sm">
                {product.image && (
                  <img
  src={product.image}
  className="card-img-top"
  alt={product.name}
  style={{
    width: "100%",
    height: "auto",   // auto height to maintain aspect ratio
    maxHeight: "200px", // optional max height
    objectFit: "contain" // contain instead of cover to show full image
  }}
/>
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    💰 Price: ₹{product.price} <br />
                    🏷️ Category:{" "}
                    {product.category ? product.category.category : "N/A"}
                  </p>
                  <div className="mt-auto d-flex justify-content-between flex-wrap">
                    {userRole === "ADMIN" ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleShowEdit(product)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(product.p_id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleBuyNow(product)}
                        >
                          Buy Now
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* ✅ Add/Edit Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {currentProduct ? "✏️ Edit Product" : "➕ Add Product"}
          </Modal.Title>
        </Modal.Header>
        <form onSubmit={handleFormSubmit}>
          <Modal.Body>
            <input
              className="form-control mb-2"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <input
              className="form-control mb-2"
              name="price"
              placeholder="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />

            {/* ✅ Category Dropdown */}
            <select
              className="form-control mb-2"
              value={form.category?.id || ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  category: { id: Number(e.target.value) },
                }))
              }
              required
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.category}
                </option>
              ))}
            </select>

            <input
              className="form-control mb-2"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {currentProduct ? "Update" : "Add"}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}

export default ProductList;
