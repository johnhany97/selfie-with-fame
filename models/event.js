let mongoose = require('mongoose');
// let validator = require('validator');

let eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  information: {
    type: String
  },
  start_date: {
    type: Date, 
    default: Date.now
  },
  end_date: {
    type: Date, 
    default: Date.now
  },
  location: {
    coordinates: {
      type: [Number],
      required: true,
    },
    city: {
      type: String,
      required: true
    }
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
