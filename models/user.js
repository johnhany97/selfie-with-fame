let mongoose = require('mongoose');
let validator = require('validator');
const { Schema } = require('mongoose');

let userSchema = new Schema({
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
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },

  ],
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  resetPasswordToken: String,
  resetPasswordExpires: Date
},
  {
    toObject: {
      virtuals: true
    },
    toJSON: {
      virtuals: true
    },
    timestamps: true
  }
);

userSchema.virtual('name').get(function () {
  return [this.first_name, this.last_name].join(' ');
}).set(function (fullName) {
  const split = fullName.split(' ');

  const firstName = split[0];
  const lastName = split[1];

  this.set('first_name', firstName);
  this.set('last_name', lastName);
});

userSchema.virtual('stories', {
  ref: 'Story',
  localField: '_id',
  foreignField: 'postedBy'
});

const User = mongoose.model('User', userSchema);

module.exports = User;
