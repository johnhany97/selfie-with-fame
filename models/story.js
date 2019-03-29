let mongoose = require('mongoose');
let validator = require('validator');

const { Schema } = mongoose;

let storySchema = new mongoose.Schema({
  text: {
    type: String
  },
  picture: {
    type: Buffer
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
}, { timestamps: true });

const Story = mongoose.model('Story', storySchema);

module.exports = Story;
