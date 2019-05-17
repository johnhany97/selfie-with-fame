const sanitizeHtml = require('sanitize-html');

const Connection = require('../models/connection');
const User = require('../models/user');
const Story = require('../models/story');
const Event = require('../models/event');
const NewsFeed = require('../models/newsfeed');

module.exports.onConnect = async (io, socket, username) => {
  // Remove any of their old connections
  await Connection.remove({ user: username });
  // Add new connection
  const connection = new Connection({
    socketId: socket.id,
    user: username,
  });
  connection.save();
}

module.exports.onDisconnect = (io, socket) => {
  Connection.findOne({ socketId: socket.id }).remove().exec();
}

module.exports.onPostStory = async (io, socket, body) => {
  const username = body.username;
  const user = await User.findOne({ username });

  const picturesParam = body.pictures;

  let pictureBuffers = [];

  if (picturesParam) {
    for (let i = 0; i < picturesParam.length; i++) {
      let pictureBlob = picturesParam[i].replace(/^data:image\/\w+;base64,/, '');
      pictureBuffers.push(new Buffer(pictureBlob, 'base64'));
    }
  }

  const story = new Story({
    text: sanitizeHtml(body.text),
    pictures: pictureBuffers,
    event: body.event_id,
    postedBy: user._id
  });

  story.save()
    .then((story) => {
      // Add to news feed
      User.findById(user._id)
        .then(async (user) => {
          // 1- Get Followers
          let followers = user.followers;
          // 2- Create entries for them
          let newsFeed = followers.map((follower) => {
            return {
              owner: follower._id,
              story: story._idß
            };
          });
          // 3- Save these entries
          await NewsFeed.insertMany(newsFeed);
          // 4- Inform the followers there's an update using Sockets
          followers.map(async (follower) => {
            const user = await User.findById(follower);
            Connection.findOne({ user: user.username })
              .then((connection) => {
                if (connection) {
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

module.exports.onRequestStories = async (io, socket, username) => {
  const stories = await Story.find({});
  io.to(socket.id).emit('receive_stories', stories);
}

module.exports.onRequestEvents = async (io, socket, username) => {
  const events = await Event.find({});
  io.to(socket.id).emit('receive_events', events);
}
