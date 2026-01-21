import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import CategoryList from "./components/CategoryList";
import PaymentPage from "./components/PaymentPage"; // ✅ Added import

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

// ✅ Wrapper to pass amount & email to PaymentPage
function PaymentWrapper() {
  const location = useLocation();
  const { amount, email } = location.state || { amount: 0, email: "test@example.com" };
  return <PaymentPage amount={amount} email={email} />;
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
          <Route path="/payment" element={<PaymentWrapper />} /> {/* ✅ Added payment route */}
          <Route path="*" element={<ProductList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
