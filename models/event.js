let mongoose = require('mongoose');
// let validator = require('validator');

let eventSchema = new mongoose.Schema({
  event_name: {
    type: String,
    required: true
  },
  information: {
    type: String
  },
  date_time: {
    type: Date, 
    default: Date.now
  },
  location: {
    type: String,
    required: true,
  }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
