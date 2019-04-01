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

module.exports.getStoriesByEvent = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  const query = {
    event: req.params.id,
  }

  Story.find(query, {}, pagination)
    .sort({ createdAt: -1 })
    .populate('postedBy', '_id first_name last_name')
    .then((stories) => {
      res.status(200).send({
        stories
      });
    });
}

module.exports.getStoriesTimeline = (req, res) => {
  res.status(500).send('Not implemented yet');
}

module.exports.createStory = (req, res) => {
  const pictureParam = req.body.picture;
  let pictureBlob;
  let pictureBuffer;
  if(pictureParam != null){
    pictureBlob = pictureParam.replace(/^data:image\/\w+;base64,/, '');
    pictureBuffer = new Buffer(pictureBlob, 'base64');
  }



  const story = new Story({
    text: req.body.text,
    picture: pictureBuffer,
    event: req.body.event_id,
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

module.exports.deleteStory = async (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  Story.findById(id)
    .then((story) => {
      if (!story) {
        return res.status(404).send();
      }
      if (!story.postedBy.equals(req.user._id)) {

        // unauthorized to delete
        return res.status(401).send('Unauthorized to delete this event');
      }
      story.remove(() => {
        res.send(story);
      });
    });
}
