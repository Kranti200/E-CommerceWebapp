import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || 1;
  const userEmail = localStorage.getItem("userEmail") || "test@example.com";
  const role = localStorage.getItem("userRole") || "USER"; // USER or ADMIN
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    const url =
      role === "ADMIN"
        ? `${API_URL}/cart/all`
        : `${API_URL}/cart/user/${userId}`;
    axios
      .get(url)
      .then((res) => {
        setCart(res.data);
        calculateTotal(res.data);
      })
      .catch((err) => console.error(err));
  };

  const calculateTotal = (cartItems) => {
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + (item.quantity || 0) * (item.product?.price || 0),
      0
    );
    setTotal(totalAmount);
  };

  const increaseQuantity = (cartId) => {
    axios
      .put(`${API_URL}/cart/increase/${cartId}`)
      .then(() => fetchCart())
      .catch((err) => console.error(err));
  };

  const decreaseQuantity = (cartId, quantity) => {
    if (quantity > 1) {
      axios
        .put(`${API_URL}/cart/decrease/${cartId}`)
        .then(() => fetchCart())
        .catch((err) => console.error(err));
    } else {
      handleRemove(cartId);
    }
  };

  const handleRemove = (cartId) => {
    axios
      .delete(`${API_URL}/cart/${cartId}`)
      .then(() => fetchCart())
      .catch((err) => console.error(err));
  };

  const getImageUrl = (product) => {
    if (!product || !product.image) return "https://via.placeholder.com/80";
    if (product.image.startsWith("http")) return product.image;
    return `http://localhost:8080/uploads/${product.image}`;
  };

  // ✅ Redirect to Payment Page
  const handleBuyNow = () => {
    if (total <= 0) {
      alert("Your cart is empty!");
      return;
    }
    navigate("/payment", {
      state: {
        amount: total,
        email: userEmail,
      },
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">
        {role === "ADMIN" ? "📊 All User Carts" : "🛒 Your Shopping Cart"}
      </h2>

      {cart.length === 0 ? (
        <p className="text-center text-muted">Cart is empty!</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle text-center">
              <thead className="table-dark">
                <tr>
                  {role === "ADMIN" && <th>User</th>}
                  <th>Image</th>
                  <th>Product</th>
                  {role !== "ADMIN" && <th>Quantity</th>}
                  <th>Price (₹)</th>
                  <th>Subtotal (₹)</th>
                  {role !== "ADMIN" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.c_id}>
                    {role === "ADMIN" && <td>{item.user?.name || "N/A"}</td>}
                    <td>
                      <img
                        src={getImageUrl(item.product)}
                        alt={item.product?.name || "No Product"}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "contain",
                        }}
                      />
                    </td>
                    <td>{item.product?.name || "Product Deleted"}</td>

                    {role !== "ADMIN" && (
                      <td>
                        <div className="d-flex justify-content-center align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              decreaseQuantity(item.c_id, item.quantity)
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => increaseQuantity(item.c_id)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                    )}

                    <td>{item.product?.price || 0}</td>
                    <td>
                      {(item.quantity || 1) * (item.product?.price || 0)}
                    </td>

                    {role !== "ADMIN" && (
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleRemove(item.c_id)}
                        >
                          ❌ Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
              <tfoot className="table-light">
                <tr>
                  <td
                    colSpan={role === "ADMIN" ? "5" : "4"}
                    className="text-end fw-bold"
                  >
                    Total:
                  </td>
                  <td
                    colSpan={role === "ADMIN" ? "1" : "2"}
                    className="fw-bold text-success"
                  >
                    ₹{total}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {role !== "ADMIN" && (
            <div className="text-end mt-3">
              <button className="btn btn-success" onClick={handleBuyNow}>
                💳 Buy Now
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Cart;
