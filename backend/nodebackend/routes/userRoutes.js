const express = require('express');
const router = express.Router();
const userController = require('../controllers/userAdminController');

router.get('/', userController.getAllUsers);
router.get('/new', userController.getNewUserForm);
router.post('/', userController.createUser);
router.get('/edit/:id', userController.getEditForm);
router.post('/update/:id', userController.updateUser);
router.post('/delete/:id', userController.deleteUser);

module.exports = router;
