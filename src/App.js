import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CategoryList from "./components/CategoryList";

// ✅ Layout component (to show/hide Navbar)
function Layout({ children }) {
  const location = useLocation();
  const hideNavbarPaths = ["/login", "/signup"];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

// ✅ Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<ProductList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
