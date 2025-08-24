// models/Company.js
const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    required: false,
  },
  motive: {
    type: String,
    required: false,
  },
  details: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  patente: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model("Company", companySchema);
