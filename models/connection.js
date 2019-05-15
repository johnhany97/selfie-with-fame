let mongoose = require('mongoose');

const { Schema } = mongoose;
let connectionSchema = new mongoose.Schema({
  socketId: {
    type: String,
    required: true
  },
  user: {
    type: String,
    ref: 'User',
    required: true
  }
});

const Connection = mongoose.model('Connection', connectionSchema);

module.exports = Connection;
