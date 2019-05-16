const passport = require('passport');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const Story = require('../models/story');
const Connection = require('../models/connection');
const User = require('../models/user');
const NewsFeed = require('../models/newsfeed');

module.exports.getAllStories = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  Story.find({}, {}, pagination)
    .sort({ createdAt: -1 })
    .populate('comments', 'username')
    .populate('postedBy', '_id first_name last_name username') // TODO: _id to be changed!!!! // name virtual property not working?
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
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
    .populate('postedBy', '_id first_name last_name username') // TODO: _id to be changed!!!! // name virtual property not working?
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
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
    .populate('comments', '_id username')
    .populate('postedBy', '_id first_name last_name username')
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story,
          liked: story.likes.indexOf(req.user._id) !== -1,
        };
      });
      res.status(200).send({
        stories
      });
    });
}

module.exports.getStoriesTimeline = async (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  const query = {
    owner: req.user._id,
  }

  NewsFeed.find(query, {}, pagination)
    .populate('story')
    .populate('comments.postedBy', 'username')
    .then((feed) => {
      let stories = feed.map((entry) => {
        return entry.story;
      })
      // sort
      stories = stories.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
      stories.map((story) => {
        return {
          ...story,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
      res.status(200).send({stories});
    });
}

module.exports.createStory = (req, res) => {
  const picturesParam = req.body.pictures;

  let pictureBuffers = [];

  if (picturesParam) {
    for (let i = 0; i < picturesParam.length; i++) {
      let pictureBlob = picturesParam[i].replace(/^data:image\/\w+;base64,/, '');
      pictureBuffers.push(new Buffer(pictureBlob, 'base64'));
    }
  }

  const story = new Story({
    text: sanitizeHtml(req.body.text),
    pictures: pictureBuffers,
    event: req.body.event_id,
    postedBy: req.user._id
  });

  story.save()
    .then((story) => {
      res.send(story);
      // Add to news feed
      User.findById(req.user._id)
        .then(async (user) => {
          // 1- Get Followers
          let followers = user.followers;
          // 2- Create entries for them
          let newsFeed = followers.map((follower) => {
            return {
              owner: follower._id,
              story: story._id
            };
          });
          // 3- Save these entries
          await NewsFeed.insertMany(newsFeed);
          // 4- Inform the followers there's an update using Sockets
          followers.map(async (follower) => {
            const user = await User.findById(follower);
            Connection.findOne({user: user.username})
              .then((connection) => {
                if (connection) {
                  const io = req.app.get('io');
                  io.to(connection.socketId).emit('new_story');
                }
              })
          })
        });
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
      res.send({
        ...story,
        liked: story.likes.indexOf(req.user._id) !== -1,
      });
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
        return res.status(404).send('Story not found');
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

/** 
 * POST /api/stories/:id/comment 
 * 
 * Used to post a comment to a story as the currently logged in user.
 * 
 * Parameters:
 * - id   => provided in the link, refers to the story ID
 * - text => provided in body, of type String, represents the text content of the comment
 * 
 * Returns:
 * - Status 201 if successfully created the comment
 * - Status 400 if error with provided parameters
 * - Status 404 if story not found
 * - Status 500 if error with saving new story with comments
*/
module.exports.comment = async (req, res) => {
  const id = req.params.id;
  
  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  const text = sanitizeHtml(req.body.text);
  const postedBy = req.user._id;

  if (!text || text === '') {
    return res.status(400).send('Invalid comment text');
  }

  const story = await Story.findById(id);
  if (!story) {
    return res.status(404).send('Story not found');
  }
  story.comments.push({
    text,
    postedBy
  });
  story.save()
    .then(() => {
      return res.status(201).send();
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * POST /api/stories/:id/like
 *
 * Used to like a story as the currently logged in user.
 *
 * Parameters:
 * - id   => provided in the link, refers to the story ID
 *
 * Returns:
 * - Status 200 if successfully liked
 * - Status 400 if error with provided parameters
 * - Status 404 if story not found
 * - Status 500 if error with saving new story with like
*/
module.exports.like = async (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  const story = await Story.findById(id);
  if (!story) {
    return res.status(404).send('Story not found');
  }

  const currentUser = req.user._id;

  if (story.likes.indexOf(currentUser) !== -1) {
    return res.status(400).send('already liked');
  }
  
  story.likes.push(currentUser);

  story.save()
    .then(() => {
      return res.status(200).send({
        ...story,
        liked: true
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * POST /api/stories/:id/unlike
 *
 * Used to unlike a story as the currently logged in user.
 *
 * Parameters:
 * - id   => provided in the link, refers to the story ID
 *
 * Returns:
 * - Status 200 if successfully unliked
 * - Status 400 if error with provided parameters
 * - Status 404 if story not found
 * - Status 500 if error with saving new story with unlike
*/
module.exports.unlike = async (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  const story = await Story.findById(id);
  if (!story) {
    return res.status(404).send('Story not found');
  }

  const currentUser = req.user._id;

  if (story.likes.indexOf(currentUser) === -1) {
    return res.status(400).send('already unliked');
  }

  story.likes = story.likes.filter((like) => {
    return like !== req.user._id;
  });

  story.save()
    .then(() => {
      return res.status(200).send({
        ...story,
        liked: false
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}
