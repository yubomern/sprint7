// routes/students.js
const express = require('express');
const router = express.Router();
const {
    getStudentStats
} = require('../controllers/studentController');


router.route('/stats')
    .get( getStudentStats);

module.exports = router;