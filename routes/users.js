const express = require('express');

let router = express.Router();

const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// POST login to the platform
router.route('/login').post(userController.login);
// POST register on the platform
router.route('/register').post(userController.register);
// POST forgot a password
router.route('/forgotPassword').post(userController.forgotPassword);
// GET activation of the link for resetting
router.route('/reset').get(userController.resetPassword);
// PUT update a password via email
router.route('/updatePasswordViaEmail').put(userController.updatePasswordViaEmail);
// GET current user
router.route('/me').all(authMiddleware.authenticate).get(userController.me);
// GET all users
router.route('/').all(authMiddleware.authenticate).get(userController.getAll);
// GET a user by username
router.route('/:username').all(authMiddleware.authenticate).get(userController.getUserByUsername);
// PUT update user profile details
router.route('/:username').all(authMiddleware.authenticate).put(userController.updateUser);
// DELETE user by username
router.route('/:username').all(authMiddleware.authenticate).delete(userController.deleteUser);
// PUT update password normally
router.route('/:username/password').all(authMiddleware.authenticate).put(userController.updatePassword);
// POST follow a user 
router.route('/:username/follow').all(authMiddleware.authenticate).post(userController.followUser);
// POST unfollow a user
router.route('/:username/unfollow').all(authMiddleware.authenticate).post(userController.unfollowUser);

module.exports = router;
