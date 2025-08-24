// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  category: { type: String },
  start_date: { type: Date, required: true },
  finish_date: { type: Date, required: true },
  status: { type: String, default: "Running" },
  tags: { type: String },
  originalPrice: { type: Number },
  discountPrice: { type: Number },
  stock: { type: Number },
  images: [
    {
      public_id: { type: String },
      url: { type: String },
      filename: { type: String },
    },
  ],
  CourseID: { type: String, required: true },
  course: { type: String, required: true },
  sold_out: { type: Number, default: 0 },
});

eventSchema.set("timestamps", true);

module.exports = mongoose.model("Meet", eventSchema);
