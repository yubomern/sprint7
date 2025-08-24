import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import './Refud.css'


export default function RefundWallet() {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const BASE_URL = import.meta.env.VITE_APP_BASE_URL||"http://localhost:4000";
  const { user } = useSelector((state) => state.profile);
  const userId  = user._id ;
  const userEmail = user.email ;

  // Fetch wallet on load
  useEffect(() => {
    fetch(`${BASE_URL}/api/v2/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.wallet !== undefined) setWallet(data.wallet);
      })
      .catch(() => setWallet(null));
  }, []);

  // Refund request
  const handleRefund = () => {
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

  if (wallet === null) return <div>Loading wallet...</div>;

  return (
    <div  className="refund-container" style={{ maxWidth: 400, margin: "auto", padding: 20, fontFamily: "Arial" }}>
      <h2>Refund to Wallet</h2>
      <span className="coin-symbol">💰</span>
    <div>
      <h2>User Wallet</h2>
      <p>Balance: <strong>${wallet.toFixed(2)}</strong></p>
      <button onClick={handleRefund} disabled={loading} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        {loading ? "Processing..." : "Refund $20 to Wallet"}
      </button>
      {message && <p style={{ marginTop: 12, color: "green" }}>{message}</p>}
    </div>
    </div>
  );
}
