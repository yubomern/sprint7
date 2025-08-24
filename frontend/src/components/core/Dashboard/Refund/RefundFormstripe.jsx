import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import './Refud.css'

function RefundFormstripe() {
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL||"http://localhost:4000";
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState(null);

  const [message, setMessage] = useState(null);

  const { user } = useSelector((state) => state.profile);
  const userId  = user._id ;
  const userEmail = user.email ;

  // Fetch user wallet balance on mount
  useEffect(() => {
  

    console.log (user);

    axios
      .get(`${BASE_URL}/api/v2/user/${userId}`) // your API endpoint to get user info
      .then((res) => setWalletBalance(res.data.walletBalance || 0))
      .catch(() => setWalletBalance(0));
  }, [userId]);

  const handleRefund = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!paymentIntentId.trim() || !amount) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    setLoading(true);
    try {
      const refundAmount = Math.round(parseFloat(amount) * 100); // convert to cents
      const response = await axios.post(`${BASE_URL}/api/refund`, {
        paymentIntentId: paymentIntentId.trim(),
        userId,
        amount: refundAmount,
      });

      setWalletBalance(response.data.walletBalance);
      setMessage({ type: "success", text: "Refund processed successfully!" });
      setPaymentIntentId("");
      setAmount("");
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Refund failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefundv2 = () => {
    setLoading(true);
    setMessage("");
    fetch(`${BASE_URL}/wallet/${userId}`, { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setWallet(data.wallet);
        setMessage(data.message);
      })
      .catch(() => setMessage("Refund failed"))
      .finally(() => setLoading(false));
  };

  return (
    <div  className="refund-container" style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h2>Refund to Wallet</h2>
      <span className="coin-symbol">💰</span>
      <p>
        User: <strong>{userEmail}</strong>
      </p>
      <p>
        Wallet Balance: <strong>${walletBalance.toFixed(2)}</strong>
      </p>
      <form onSubmit={handleRefundv2}>
        <div style={{ marginBottom: 10 }}>
          <label>Payment Intent ID</label>
          <input
            type="text"
            value={paymentIntentId}
            onChange={(e) => setPaymentIntentId(e.target.value)}
            placeholder="pi_..."
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Amount to Refund ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount in USD"
            min="0"
            step="0.01"
            style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ padding: "10px 15px" }}>
          {loading ? "Processing..." : "Refund"}
        </button>
      </form>
      {message && (
        <div
          style={{
            marginTop: 15,
            padding: 10,
            backgroundColor: message.type === "error" ? "#f8d7da" : "#d4edda",
            color: message.type === "error" ? "#721c24" : "#155724",
            borderRadius: 4,
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}

export default RefundFormstripe;
