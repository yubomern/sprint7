// src/routes/reclamation.routes.js
const router = require('express').Router();
const { auth, isAdmin } = require('../middleware/auth');
const c = require('../controllers/reclamationController');

// user creates
router.post('/', c.create);
// admin/moderator reads & filters
router.get('/', c.list);
// moderation
router.patch('/:id/status', isAdmin, c.updateStatus);
module.exports = router;
