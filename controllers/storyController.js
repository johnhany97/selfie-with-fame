const passport = require('passport');
const validator = require('validator');
const sanitizeHtml = require('sanitize-html');

const Story = require('../models/story');
const Connection = require('../models/connection');
const User = require('../models/user');
const NewsFeed = require('../models/newsfeed');


/**
 * GET /api/stories
 *
 * @summary
 * Get all stories
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - size => Number   - number of users / page (Default: 10)
 * - page => Number   - which page we're at (Default: 1)
 *
 * @returns:
 * - Status 200 if successful
 * - Status 500 if an error occurs when interacting with the db
  * If successful, it returns a JSON of the following format:
 * {
 *  [ Stories ]
 * }
*/

module.exports.getAllStories = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  Story.find({}, {}, pagination)
    .sort({ createdAt: -1 })
    .populate('postedBy', '_id first_name last_name username')
    .populate('comments.postedBy', 'username')
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story._doc,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
      res.status(200).send({
        stories,
      });
    });
}


/**
 * GET /api/stories/:user
 *
 * @summary
 * Get stoires created by a user
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - user => User     - A user object
 * - size => Number   - number of stories / page (Default: 10)
 * - page => Number   - which page we're at (Default: 1)
 *
 * @returns:
 * - Status 200 if successful
* If successful, it returns a JSON of the following format:
 * {
 *  [ Stories ]
 * 
*/

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
    .populate('postedBy', '_id first_name last_name username')
    .populate('comments.postedBy', 'username')
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story._doc,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
      res.status(200).send({
        stories
      });
    });
}


/**
 * GET /api/stories/event/:id
 *
 * @summary
 * Get stories for an event
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - id => String     - An event's id
 * - size => Number   - number of stories / page (Default: 10)
 * - page => Number   - which page we're at (Default: 1)
 *
 * @returns:
 * - Status 200 if successful
* If successful, it returns a JSON of the following format:
 * {
 *  [ Stories ]
 * 
*/


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
    .populate('postedBy', '_id first_name last_name username')
    .populate('comments.postedBy', 'username')
    .then((stories) => {
      stories.map((story) => {
        return {
          ...story._doc,
          liked: story.likes.indexOf(req.user._id) !== -1,
        };
      });
      res.status(200).send({
        stories
      });
    });
}


/**
 * GET /api/stories/
 *
 * @summary
 * Get stories for the timeline
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - User => User     - logged in user
 * - size => Number   - number of stories / page (Default: 10)
 * - page => Number   - which page we're at (Default: 1)
 *
 * @returns:
 * - Status 200 if successful
* If successful, it returns a JSON of the following format:
 * {
 *  [ Stories ]
 * 
*/


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
    .populate('story.postedBy', '_id first_name last_name username')
    .populate('story.comments.postedBy', 'username')
    .then((feed) => {
      let stories = feed.map((entry) => {
        return entry.story;
      })
      // sort
      stories = stories.sort((a, b) => (a.createdAt < b.createdAt) ? 1 : -1);
      stories.map((story) => {
        return {
          ...story._doc,
          liked: story.likes.indexOf(req.user._id) !== -1
        };
      });
      res.status(200).send({stories});
    });
}



/**
 * POST '/api/stories/
 *
 * @summary
 * Create a story
 *
 * @auth
 * Does require authentication 
 *
 * @param
 * - User => User     - logged in user
 * - Event  => Evemt   - the Event the story belongs to
 * - pictures => [ int ] = binary of pictures
 * - text      => string   - info about story
 *
 * @returns:
 * - Status 20 if event created successfully
 * - Status 400 if bad request

*/

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
          // also add our own story to our own timeline
          newsFeed.push({
            owner: req.user._id,
            story: story._id
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

/**
 * GET /api/stories/:id
 *
 * @summary
 * Get an story by its id
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - id => String     - story id
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if story not found
 * * If successful, it returns a JSON of the following format:
 * {
 *  story
 * 
*/module.exports.getStory = (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('Invalid ID');
  }

  Story.findById(id)
    .populate('postedBy', '_id first_name last_name username')
    .populate('comments.postedBy', 'username')
    .then((story) => {
      if (!story) {
        return res.status(404).send();
      }
      res.send({
        ...story._doc,
        liked: story.likes.indexOf(req.user._id) !== -1,
      });
    });
}


/**
 * DELETE /api/stories/:id

 * @summary
 * Delete a story by its id
 *
 * @auth
 * Requires signed in user and created the story
 *
 * @param
 * - id => String   -story id
 *
 * @returns:
 * - Status 400 if bad request
 * - Status 404 if user not found
 * - Status 401 not auurtherised to delete story
*/
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
        ...story._doc,
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
 * @param:
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
        ...story._doc,
        liked: false
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}
