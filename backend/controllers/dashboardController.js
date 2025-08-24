// src/controllers/dashboard.controller.js
const User = require('../models/user');
const Post = require('../models/PostUser');
const Reclamation = require('../models/Reclamation');

exports.teacherStats = async (req,res) => {
  const teacherId = req.user.id;

  const teacher = await User.findById(teacherId).populate('followers','_id');
  const followersCount = teacher?.followers?.length || 0;

  const postsCount = await Post.countDocuments({ author: teacherId });
  const commentsCount = await Post.aggregate([
    { $match: { author: require('mongoose').Types.ObjectId.createFromHexString(teacherId) } },
    { $project: { cSize: { $size: '$comments' } } },
    { $group: { _id: null, total: { $sum: '$cSize' } } }
  ]);
  const totalComments = commentsCount[0]?.total || 0;

  const openRecls = await Reclamation.countDocuments({ targetUser: teacherId, status: { $in: ['open','in_review'] }});

  res.json({
    followersCount,
    postsCount,
    totalComments,
    openReclamations: openRecls,
    rating: teacher?.rating || 0,
    totalEarnings: teacher?.totalEarnings || 0,
    lastUpdated: new Date().toISOString()
  });
};
