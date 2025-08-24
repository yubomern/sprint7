const Company = require('../models/Company');

// Create
exports.createCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read all
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read one
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.status(200).json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
