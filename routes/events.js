var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');


router.route('/').all(authMiddleware.authenticate).get(eventController.getEvents);
router.route('/').all(authMiddleware.authenticate).post(eventController.createEvent);
// router.route('/story/:id').all(authMiddleware.authenticate).post(eventController.getEvent);
// router.route('/story/:id').all(authMiddleware.authenticate).delete(eventController.deleteEvent);
// router.post('/login', userController.login);
// router.post('/register', userController.register);
// router.get('/find', userController.findUser);
// router.delete('/delete', userController.deleteUser);
// router.post('/forgotPassword', userController.forgotPassword);
// router.get('/reset', userController.resetPassword);
// router.put('/updatePassword', userController.updatePassword);
// router.put('/updatePasswordViaEmail', userController.updatePasswordViaEmail);
// router.put('/updateUser', userController.updateUser);

module.exports = router;
