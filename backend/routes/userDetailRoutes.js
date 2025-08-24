const express = require("express");
const router = express.Router();
const UserDetail = require("../models/UserDetail");
const {auth} = require('../middleware/auth');
const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// ✅ Check if phone exists
router.get("/check/:phone", async (req, res) => {
  try {
    const phone = req.params.phone;
    const found = await UserDetail.findOne({ phoneNumber: phone });
    res.json({ exists: !!found });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add / Update user profile
router.post("/update",  auth , async (req, res) => {
  try {
    const { phoneNumber, bio  , userId } = req.body;
    let userDetail = await UserDetail.findOne({ userId: userId });

    if (userDetail) {
      userDetail.phoneNumber = phoneNumber;
      userDetail.bio = bio;
    } else {
      userDetail = new UserDetail({ userId: userId, phoneNumber, bio });
    }

    await userDetail.save();

    // Send SMS via Twilio
    if (phoneNumber) {
      await client.messages.create({
        body: `Hello! Your profile has been updated.`,
        from: process.env.TWILIO_PHONE_NUMBER, // Twilio number
        to: phoneNumber,
      });
    }

    res.json({ success: true, userDetail });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
