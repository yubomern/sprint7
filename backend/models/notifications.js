// src/models/Notification.js
const mongoose = require('mongoose');

const notifSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User', required:true },
  type: { type:String, enum:['system','comment','follow','reclamation','course','payment'], default:'system' },
  title: { type:String, required:true },
  message: { type:String, default:'' },
  meta: { type: Object, default: {} },
  read: { type:Boolean, default:false }
}, { timestamps:true });

module.exports = mongoose.model('Notification', notifSchema);
