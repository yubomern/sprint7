const UserAdmin = require('../models/useradmin');
const Company = require('../models/Company');

// GET all users
exports.getAllUsers = async (req, res) => {
  const users = await UserAdmin.find().populate('company');
  res.render('users/index', { users });
};

// GET form to create user
exports.getNewUserForm = async (req, res) => {
  const companies = await Company.find();
  res.render('users/new', { companies });
};

// POST create new user
exports.createUser = async (req, res) => {
  await UserAdmin.create(req.body);
  res.redirect('/users');
};

// GET edit form
exports.getEditForm = async (req, res) => {
  const user = await UserAdmin.findById(req.params.id);
  const companies = await Company.find();
  res.render('users/edit', { user, companies });
};

// POST update user
exports.updateUser = async (req, res) => {
  await UserAdmin.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/users');
};

// DELETE user
exports.deleteUser = async (req, res) => {
  await UserAdmin.findByIdAndDelete(req.params.id);
  res.redirect('/users');
};
