// routes/courses.js
const express = require('express');
const router = express.Router();
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseStats
} = require('../controllers/adminController');


// Add this route
router.route('/stats')
    .get( getCourseStats);

// Other existing routes...
module.exports = router;