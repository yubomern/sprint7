const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET /api/user/:id - get user info by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("email walletBalance");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // return user email and wallet balance (convert to dollars if stored in cents)
    res.json({
      email: user.email,
      walletBalance: user.walletBalance, // assuming stored as dollars
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/", async (req, res) => {
  const { amount ,userId} = req.body;
  const user = await User.findById(userId);
  console.table(user);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount" });
  }

  user.balance += amount;
  await user.save();

  res.json({ message: "Balance updated", balance: user.balance });
});

module.exports = router;
