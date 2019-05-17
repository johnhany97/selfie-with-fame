var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');


router.route('/getEvents').all(authMiddleware.authenticate).get(eventController.getEvents);
router.route('/getEventsByLocation').all(authMiddleware.authenticate).post(eventController.getEventsByLocation);
router.route('/getEventsByLocationAndDate').all(authMiddleware.authenticate).post(eventController.getEventsByLocationAndDate);


router.route('/createEvent').all(authMiddleware.authenticate).post(eventController.createEvent);
router.route('/deleteEvent').all(authMiddleware.authenticate).delete(eventController.deleteEvent);

router.route('/findEvent').all(authMiddleware.authenticate).get(eventController.findEvent);

router.route('/eventPage/:id').all(authMiddleware.authenticate).get(eventController.findEvent);
router.route('/updateEvent/').all(authMiddleware.authenticate).put(eventController.updateEvent);

router.route('/:id').all(authMiddleware.authenticate).get(eventController.getEventById);

module.exports = router;
