var express = require('express');

var router = express.Router();

var userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/find', userController.findUser);
router.delete('/delete', userController.deleteUser);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/reset', userController.resetPassword);
router.put('/updatePassword', userController.updatePassword);
router.put('/updatePasswordViaEmail', userController.updatePasswordViaEmail);
router.put('/updateUser', userController.updateUser);
router.route('/').all(authMiddleware.authenticate).get(userController.getAll);
router.route('/:username').all(authMiddleware.authenticate).get(userController.getUserByUsername);
router.route('/:username/follow').all(authMiddleware.authenticate).post(userController.followUser);
router.route('/:username/unfollow').all(authMiddleware.authenticate).post(userController.unfollowUser);

module.exports = router;
