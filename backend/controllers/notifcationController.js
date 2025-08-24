// src/controllers/notification.controller.js
const Notification = require('../models/Notification');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587, secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});
const smsClient = (process.env.TWILIO_SID && process.env.TWILIO_TOKEN)
  ? twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
  : null;

exports.create = async (req,res) => {
  const { userId, type='system', title, message, email=false, sms=false } = req.body;

  const notif = await Notification.create({ user: userId, type, title, message });

  // push via socket
  const io = req.app.get('io');
  io.to(`user:${userId}`).emit('notification:new', notif);

  // optional email
  if (email) {
    const u = await User.findById(userId);
    if (u?.email) await mailer.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@example.com',
      to: u.email, subject: title, text: message, html: `<p>${message}</p>`
    });
  }

  // optional SMS
  if (sms && smsClient) {
    const u = await User.findById(userId);
    if (u?.phoneNumber) {
      await smsClient.messages.create({
        from: process.env.TWILIO_FROM, to: u.phoneNumber, body: `${title}: ${message}`
      });
    }
  }

  res.status(201).json({ success:true, notif });
};

exports.listMine = async (req,res) => {
  const items = await Notification.find({ user: req.user.id }).sort({ createdAt:-1 });
  res.json(items);
};

exports.markRead = async (req,res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read:true });
  res.json({ success:true });
};
