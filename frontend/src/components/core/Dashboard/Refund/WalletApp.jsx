import React, { useEffect, useState } from "react";
import axios from "axios";
import {useSelector} from "react-redux";
import  './Refud.css'
const API_URL = "http://localhost:4000";

function WalletApp() {
    const [userwallet, setUserWallet] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const { user } = useSelector((state) => state.profile);
    const userId = user._id;

    const userEmail = user.email;

    const fetchUser = async () => {
        try {
            const res = await axios.get(API_URL+"/api/v2/user/"+userId);
            setUserWallet(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const addBalance = async () => {
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setMessage("Please enter a valid positive amount");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/api/v2/user`, { amount: numAmount,userId:userId });
            setUserWallet((prev) => ({ ...prev, balance: res.data.balance }));
            setMessage("Balance updated successfully");
            setAmount("");
        } catch (err) {
            console.error(err);
            setMessage("Error updating balance");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "Arial" }} className="refund-container">
            <h2>User Balance</h2>
            {user ? (
                <div>
                    <p>
                        {userEmail}
                        <strong>Username:</strong> {user.firstName}
                    </p>
                    <p>
                        <strong>Balance:</strong> ${userwallet?.balance?.toFixed(2)}
                    </p>

                    <input
                        type="number"
                        step="0.01"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
                    />
                    <button
                        onClick={addBalance}
                        disabled={loading}
                        style={{ width: "100%", padding: "10px", fontWeight: "bold" }}
                    >
                        {loading ? "Adding..." : "Add Balance"}
                    </button>
                    {message && <p style={{ marginTop: "10px", color: "green" }}>{message}</p>}
                </div>
            ) : (
                <p>Loading user info...</p>
            )}
        </div>
    );
}

export default WalletApp;
