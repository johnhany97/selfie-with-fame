let mongoose = require('mongoose');
let validator = require('validator');

let userSchema = new mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    validate: validator.isEmail,
    message: '{VALUE} is not a valid email',
    isAsync: false,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

module.exports = User;
