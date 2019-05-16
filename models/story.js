let mongoose = require('mongoose');
let validator = require('validator');

const { Schema } = mongoose;

let storySchema = new Schema({
  text: {
    type: String
  },
  pictures: [{
    type: Buffer
  }],
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
