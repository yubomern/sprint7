// src/routes/notification.routes.js
const router = require('express').Router();
const { auth } = require('../middlewares/auth');
const c = require('../controllers/notifcationController');
router.post('/', c.create);        // create + (email/sms optional)
router.get('/me', c.listMine);     // mes notifications
router.patch('/:id/read', c.markRead);
module.exports = router;
