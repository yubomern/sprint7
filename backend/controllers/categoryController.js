const Category = require('../models/category');

// List all categories
exports.index = async (req, res) => {
  const categories = await Category.find();
  res.render('categories/index', { categories });
};

// Show form to create
exports.createForm = (req, res) => {
  res.render('categories/create');
};

// Handle create
exports.create = async (req, res) => {
  await Category.create(req.body);
  res.redirect('/categories');
};

// Show details
exports.show = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('categories/show', { category });
};

// Show edit form
exports.editForm = async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.render('categories/edit', { category });
};

// Handle update
exports.update = async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/categories');
};

// Handle delete
exports.delete = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.redirect('/categories');
};
