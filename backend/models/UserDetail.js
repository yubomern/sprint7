const mongoose = require("mongoose");

const userDetailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  phoneNumber: { type: String, required: false },
  bio: { type: String, default: "" },
});

module.exports = mongoose.model("UserDetail", userDetailSchema);
