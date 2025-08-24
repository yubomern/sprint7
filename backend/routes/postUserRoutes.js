// src/routes/post.routes.js
const router = require('express').Router();
const { auth, isInstructor } = require('../middleware/auth');
const c = require('../controllers/postUserController');
router.post('/', isInstructor, c.createPost);
router.post('/:postId/comments', c.comment);
router.get('/teacher/:teacherId', c.listByTeacher);
module.exports = router;
