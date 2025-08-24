// src/models/Post.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  text: { type:String, required:true },
}, { timestamps:true });

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true }, // Prof
  text: { type:String, required:true },
  images: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref:'User' }],
  comments: [commentSchema]
}, { timestamps:true });

module.exports = mongoose.model('Postuser', postSchema);
