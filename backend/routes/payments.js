const express = require('express');
const router = express.Router();

//const { capturePayment, verifyPayment } = require('../controllers/payments');
const { auth, isAdmin, isInstructor, isStudent } = require('../middleware/auth');

// router.post('/capturePayment', auth, isStudent, capturePayment);
// router.post('/verifyPayment', auth, isStudent, verifyPayment);


const { enrollFreeCourse } = require('../controllers/payments');


router.post('/enroll-course', auth ,  enrollFreeCourse);

module.exports = router;



