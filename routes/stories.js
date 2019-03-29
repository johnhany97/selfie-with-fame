var express = require('express');

var storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/auth');

var router = express.Router();

router.route('/').all(authMiddleware.authenticate).get(storyController.getStoriesByUser);
router.route('/').all(authMiddleware.authenticate).post(storyController.createStory);
router.route('/story/:id').all(authMiddleware.authenticate).post(storyController.getStory);
router.route('/story/:id').all(authMiddleware.authenticate).delete(storyController.deleteStory);

module.exports = router;
