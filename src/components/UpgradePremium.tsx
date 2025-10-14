import React, { useState } from "react";
import { initializePayment, verifyPayment } from "../utils/paymentApi";

const UpgradePremium: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [payUrl, setPayUrl] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const startPayment = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await initializePayment(email);
      setPayUrl(result.authorization_url);
      setPaymentRef(result.reference);
      setStatus("initialized");
    } catch (err: any) {
      setError(err.message || "Failed to initialize payment.");
    }
    setLoading(false);
  };

  const checkPayment = async () => {
    if (!paymentRef) return;
    setLoading(true);
    setError("");
    try {
      const result = await verifyPayment(paymentRef);
      setStatus(result.status === "success" ? "completed" : "pending");
    } catch (err: any) {
      setError(err.message || "Failed to verify payment.");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Upgrade to Premium</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />
      <button onClick={startPayment} disabled={loading || !email}>
        Initialize Payment
      </button>

      {payUrl && status === "initialized" && (
        <div>
          <p>Click below to complete payment:</p>
          <a href={payUrl} target="_blank" rel="noopener noreferrer">Pay with Paystack</a>
          <button onClick={checkPayment} disabled={loading}>
            I've Paid – Verify Payment
          </button>
        </div>
      )}

      {status === "completed" && (
        <p>Payment successful! You are now a premium user.</p>
      )}
      {status === "pending" && (
        <p>Payment pending or not completed yet.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default UpgradePremium;