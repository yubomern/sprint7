// src/controllers/reclamation.controller.js
const Reclamation = require('../models/Reclamation');

exports.create = async (req,res) => {
  const { title, description, targetUser } = req.body;
  const item = await Reclamation.create({
    user: req.user._id, targetUser, title, description
  });
  res.status(201).json(item);
};

exports.list = async (req,res) => {
  const q = {};
  if (req.query.status) q.status = req.query.status;
  const items = await Reclamation.find(q).populate('user', 'firstName lastName email').sort({ createdAt:-1 });
  res.json(items);
};

exports.updateStatus = async (req,res) => {
  const { status, notes } = req.body; // in_review / resolved / rejected
  const item = await Reclamation.findByIdAndUpdate(
    req.params.id, { status, notes }, { new:true }
  );
  if (!item) return res.status(404).json({ message:'Not found' });
  res.json(item);
};
