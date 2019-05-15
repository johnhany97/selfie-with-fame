let mongoose = require('mongoose');
let validator = require('validator');

const { Schema } = mongoose;

let storySchema = new Schema({
  text: {
    type: String
  },
  picture: {
    type: Buffer
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [
    {
      text: {
        type: String,
        required: true
      },
      postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      }
    }
  ],
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
