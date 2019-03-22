var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/find', userController.findUser);
router.delete('/delete', userController.deleteUser);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/reset', userController.resetPassword);
router.put('/updatePassword', userController.updatePassword);
router.put('/updatePasswordViaEmail', userController.updatePasswordViaEmail);
router.put('/updateUser', userController.updateUser);

module.exports = router;
