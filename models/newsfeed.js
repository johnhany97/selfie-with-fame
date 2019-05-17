let mongoose = require('mongoose');

const { Schema } = mongoose;

let newsFeedSchema = new mongoose.Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  story: {
    type: Schema.Types.ObjectId,
    ref: 'Story',
    required: true
  }
});

const NewsFeed = mongoose.model('NewsFeed', newsFeedSchema);

module.exports = NewsFeed;
