// routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const { addRatingAndReview } = require('../controllers/adminControllerCoursestats');


router.post('/rate', addRatingAndReview);

module.exports = router;
