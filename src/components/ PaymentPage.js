import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentPage = ({ amount, email }) => {
  const API_URL = "http://localhost:8080";

  const handlePayment = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/payment/create-order`, {
        amount,
        email,
      });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "E-Commerce Store",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          alert("Payment successful!");
          console.log(response);
          await axios.post(`${API_URL}/payment/verify`, response);
        },
        prefill: {
          name: "Test User",
          email: email,
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Error starting payment!");
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="container text-center mt-5">
      <h2>💳 Secure Payment</h2>
      <p className="text-muted">You are about to pay ₹{amount}</p>
      <button className="btn btn-success" onClick={handlePayment}>
        Proceed to Pay
      </button>
    </div>
  );
};

export default PaymentPage;
