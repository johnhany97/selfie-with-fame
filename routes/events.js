var express = require('express');
var router = express.Router();
var eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');


// GET all events
router.route('/getEvents').all(authMiddleware.authenticate).get(eventController.getEvents);
// POST events by location
router.route('/getEventsByLocation').all(authMiddleware.authenticate).post(eventController.getEventsByLocation);
// POST events by location and date
router.route('/getEventsByLocationAndDate').all(authMiddleware.authenticate).post(eventController.getEventsByLocationAndDate);
// POST create event
router.route('/createEvent').all(authMiddleware.authenticate).post(eventController.createEvent);
// DELETE an event
router.route('/deleteEvent').all(authMiddleware.authenticate).delete(eventController.deleteEvent);
// GET an event
router.route('/findEvent').all(authMiddleware.authenticate).get(eventController.findEvent);
// GET an event by id
router.route('/eventPage/:id').all(authMiddleware.authenticate).get(eventController.findEvent);
// PUT update an event
router.route('/updateEvent/').all(authMiddleware.authenticate).put(eventController.updateEvent);
// GET an event by id
router.route('/:id').all(authMiddleware.authenticate).get(eventController.getEventById);

module.exports = router;
