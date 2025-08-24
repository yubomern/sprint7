// src/routes/follow.routes.js
const router = require('express').Router();
const { auth } = require('../middleware/auth');
const c = require('../controllers/followController');
router.post('/', auth, c.follow);
router.post('/unfollow', auth, c.unfollow);
router.get('/:teacherId', auth, c.listFollowers);
module.exports = router;
