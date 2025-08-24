import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./Refund.css";

function RefundForm() {
    const BASE_URL = import.meta.env.VITE_APP_BASE_URL || "http://localhost:4000";
    const [amount, setAmount] = useState("");
    const [walletBalance, setWalletBalance] = useState(0);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);

    const { user } = useSelector((state) => state.profile);
    const userId = user._id;

    const userEmail = user.email;

    // Fetch wallet balance on mount
    useEffect(() => {
        axios
            .get(`${BASE_URL}/api/v2/user/${userId}`)
            .then((res) => setWalletBalance(res.data.wallet || 0))
            .catch(() => setWalletBalance(0));
    }, [userId]);

    const handleRefund = async (e) => {
        e.preventDefault();
        alert(userId);
        setMessage(null);

        if (!amount) {
            setMessage({ type: "error", text: "Please enter refund amount" });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/api/refund/balance`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(amount),userId: userId })
            });

            const data = await response.json();

            console.log(data);
            alert(data);

            setTimeout(()=>console.log("wallet"  , 5000));

            if (response.ok) {
                setWalletBalance(data.wallet);
                setMessage({ type: "success", text: data.message });
                setAmount("");
            } else {
                setMessage({ type: "error", text: data.error || "Refund failed" });
            }
        } catch (err) {
            setMessage({ type: "error", text: "Refund failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="refund-container" style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h2>Refund to Wallet</h2>
            <span className="coin-symbol">💰 {user?.balence} </span>
            <p>
                User: <strong>{userEmail}</strong>
            </p>
            <p>
                Wallet Balance: <strong>${walletBalance.toFixed(2)}</strong>
            </p>
            <form onSubmit={handleRefund}>
                <div style={{ marginBottom: 10 }}>
                    <label>Amount to Refund ($)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount in USD"
                        min="0"
                        step="0.01"
                        style={{ width: "100%", padding: 8 }}
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
                        borderRadius: 4
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
    );
}

export default RefundForm;
