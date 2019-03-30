const passport = require('passport');
const validator = require('validator');

var Story = require('../models/story');

module.exports.getAllStories = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  Story.find({}, {}, pagination)
    .sort({ createdAt: -1 })
    .populate('postedBy', '_id first_name last_name') // TODO: _id to be changed!!!! // name virtual property not working?
    .then((stories) => {
      res.status(200).send({
        stories,
      });
    });
}

module.exports.getStoriesByUser = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  const query = {
    postedBy: req.user._id
  }
  // no need to populate as current user is poster
  Story.find(query, {}, pagination)
    .sort({ createdAt: -1 })
    .then((stories) => {
      res.status(200).send({
        stories
      });
    });
}

module.exports.getStoriesTimeline = (req, res) => {

}

module.exports.createStory = (req, res) => {
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

// This gets any story by it's id, not just ones a user created
module.exports.getStory = (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  Story.findById(id)
    .then((story) => {
      if (!story) {
        return res.status(404).send();
      }
      res.send(story);
    });
}

module.exports.deleteStory = (req, res) => {
  res.status(500).send('Not implemented yet');
}
