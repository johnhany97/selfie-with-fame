const passport = require('passport');

var Story = require('../models/story');

module.exports.getStoriesByUser = (req, res, next) => {
  Story.find({ postedBy: req.user._id })
    .sort({ createdAt: -1 })
    .then((stories) => {
      res.status(200).send({
        stories,
      });
    });
}

module.exports.createStory = (req, res, next) => {
  const story = new Story({
    text: req.body.text,
    picture: req.body.picture,
    postedBy: req.user._id
  });

  story.save()
    .then((story) => {
      res.send(story);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
}

module.exports.getStory = (req, res, next) => {
  res.status(500).send('Not implemented yet');
}

module.exports.deleteStory = (req, res, next) => {
  res.status(500).send('Not implemented yet');
}
