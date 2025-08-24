const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");

// POST /refund
// Body: { paymentIntentId: string, userId: string, amount: number (in cents) }


/*
    async function refundCharge(chargeId, amount = null) {
      try {
        const refundOptions = {
          charge: chargeId,
        };

        if (amount !== null) {
          refundOptions.amount = amount; // For partial refunds, specify the amount in cents
        }

        const refund = await stripe.refunds.create(refundOptions);
        console.log('Refund successful:', refund);
        return refund;
      } catch (error) {
        console.error('Error creating refund:', error);
        throw error;
      }
    }

    // Example usage for a full refund:
    // refundCharge('ch_1234567890abcdefghijklmn');

    // Example usage for a partial refund (e.g., refunding $10.50):
    // refundCharge('ch_1234567890abcdefghijklmn', 1050);


reouter .post('/' , async (req,res) => {


    try {
        const { paymentIntentId, userId, amount } = req.body;
        const refundOptions = {
          charge: paymentIntentId,
        };

        if (!paymentIntentId || !userId || !amount) {
            return res.status(400).json({ error: "Missing required fields" });
          }

        if (amount !== null) {
          refundOptions.amount = amount; // For partial refunds, specify the amount in cents
        }

        const refund = await stripe.refunds.create(refundOptions);
        console.log('Refund successful:', refund);
        return refund;
      } catch (error) {
        console.error('Error creating refund:', error);
        throw error;
      }


})





*/


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
    await req.user.save();

    res.json({ message: "Balance updated", balance: req.user.balance });
});
// POST /wallet/:userId -> refund to wallet
router.post("/wallet/:userId", async (req, res) => {
    try {
        let { amount } = req.body;

        amount = Number(amount); // ensure it's a number
        if (!amount || isNaN(amount)) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Add to wallet (default to 0 if null)
        user.wallet = (user.wallet || 0) + amount;

        await user.save();

        res.json({
            message: `Refunded $${amount} to wallet`,
            wallet: user.wallet
        });
    } catch (error) {
        console.error("Wallet refund error:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.post("/walletv2/:userId", async  (req, res) => {
    const {  amount } = req.body;

    const user = await User.findById(req.params.userId);
    console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

   
    
  
    const refundAmount = amount; // static refund amount $20
    user.wallet += refundAmount;

    await user.save();
  
    res.json({
      message: `Refunded $${refundAmount} to wallet`,
      wallet: user.wallet,
    });
  });

router.post("/b", async (req, res) => {
  try {

    console.log(process.env.STRIPE_SECRET_KEY);
    const { paymentIntentId, userId, amount } = req.body;

    if (!paymentIntentId || !userId || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create a refund on Stripe
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount, // amount in cents
    });

    // Update user wallet (increase balance by refund amount in your currency)
    const refundAmount = amount / 100; // convert cents to dollars (or your currency)
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.walletBalance += refundAmount;
    await user.save();

    return res.json({
      message: "Refund successful, wallet updated",
      refund,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

module.exports = router;
