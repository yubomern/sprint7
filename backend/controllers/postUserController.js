// src/controllers/post.controller.js
const Post = require('../models/PostUser');

exports.createPost = async (req,res) => {
  // réservé profs
  const post = await Post.create({
    author: req.user.id,
    text: req.body.text,
    images: req.body.images || []
  });
  res.status(201).json(post);
};

exports.comment = async (req,res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const post = await Post.findByIdAndUpdate(
    postId,
    { $push: { comments: { author: req.user.id, text } } },
    { new:true }
  ).populate('comments.author','firstName lastName image');
  if (!post) return res.status(404).json({ message:'Post not found' });

  // notifier l'auteur du post
  const io = req.app.get('io');
  io.to(`user:${post.author}`).emit('notification:new', {
    type:'comment', title:'Nouveau commentaire', message:text, postId, createdAt:new Date()
  });

  res.json(post);
};

exports.listByTeacher = async (req,res) => {
  const posts = await Post.find({ author: req.params.teacherId })
    .sort({ createdAt:-1 })
    .populate('author','firstName lastName image')
    .populate('comments.author','firstName lastName image');
  res.json(posts);
};
