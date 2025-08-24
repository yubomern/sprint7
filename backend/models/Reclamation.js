// src/models/Reclamation.js
const mongoose = require('mongoose');

const reclamationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref:'User' }, // ex: prof concerné
  title: { type:String, required:true },
  description: { type:String, required:true },
  status: { type:String, enum:['open','in_review','resolved','rejected'], default:'open' },
  notes: { type:String, default:'' },  // modérateur
}, { timestamps:true });

module.exports = mongoose.model('Reclamation', reclamationSchema);
