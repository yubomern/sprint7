// src/controllers/follow.controller.js
const User = require('../models/user');

exports.follow = async (req,res) => {
  const { teacherId } = req.body;
  if (String(teacherId) === String(req.user.id)) return res.status(400).json({ message:'cannot follow yourself' });

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { following: teacherId }});
  await User.findByIdAndUpdate(teacherId, { $addToSet: { followers: req.user.id }});

  // socket notify teacher
  const io = req.app.get('io');
  io.to(`user:${teacherId}`).emit('notification:new', {
    type:'follow', title:'New follower', message:`${req.user.email} a suivi votre profil`, createdAt: new Date()
  });

  res.json({ success:true });
};

exports.unfollow = async (req,res) => {
  const { teacherId } = req.body;
  await User.findByIdAndUpdate(req.user.id, { $pull: { following: teacherId }});
  await User.findByIdAndUpdate(teacherId, { $pull: { followers: req.user.id }});
  res.json({ success:true });
};

exports.listFollowers = async (req,res) => {
  const teacher = await User.findById(req.params.teacherId).populate('followers','firstName lastName email image');
  res.json(teacher?.followers || []);
};
