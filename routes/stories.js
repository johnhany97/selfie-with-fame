var express = require('express');

var storyController = require('../controllers/storyController');
const authMiddleware = require('../middleware/auth');

var router = express.Router();

// GET all stories by all users
router.route('/all').all(authMiddleware.authenticate).get(storyController.getAllStories);
// GET all stories by the current logged in user
router.route('/').all(authMiddleware.authenticate).get(storyController.getStoriesByUser);
// GET all stories for a given event
router.route('/event/:id').all(authMiddleware.authenticate).get(storyController.getStoriesByEvent);
// PUT a new story by the logged in user
router.route('/').all(authMiddleware.authenticate).put(storyController.createStory);
// GET a story by it's id, doesn't have to be the user's atm
router.route('/:id').all(authMiddleware.authenticate).get(storyController.getStory);
// DELETE a story if you're the creator
router.route('/:id').all(authMiddleware.authenticate).delete(storyController.deleteStory);
// GET the logged in user's timeline
router.route('/timeline').all(authMiddleware.authenticate).get(storyController.getStoriesTimeline);
// POST a comment to a story
router.route('/:id/comment').all(authMiddleware.authenticate).post(storyController.comment);
// POST a like to a story
router.route('/:id/like').all(authMiddleware.authenticate).post(storyController.like);

module.exports = router;
