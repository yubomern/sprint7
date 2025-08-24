// src/routes/dashboard.routes.js
const router = require('express').Router();
const { auth, isInstructor } = require('../middleware/auth');
const c = require('../controllers/dashboardController');
router.get('/teacher', isInstructor, c.teacherStats);
module.exports = router;
