const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

var User = require('../models/user');

const BCRYPT_SALT_ROUNDS = 12;

module.exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      if (info.message === 'bad username') {
        res.status(401).send(info.message);
      } else {
        res.status(403).send(info.message);
      }
    } else {
      req.logIn(user, err => {
        User.findOne({
          username: user.username,
        }).then(user => {
          const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET);
          res.status(200).send({
            auth: true,
            token: token,
            message: 'user found & logged in',
          });
        });
      });
    }
  })(req, res, next);
}

module.exports.register = (req, res, next) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  if (!first_name || !last_name || !email || !username || !password) {
    res.send('Missing parameters')
    return;
  }
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(403).send(info.message);
    } else {
      req.logIn(user, err => {
        const data = {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
          username: user.username,
        };
        User.findOne({
          username: data.username,
        }).then(user => {
          user
            .update({
              first_name: data.first_name,
              last_name: data.last_name,
              email: data.email,
            })
            .then(() => {
              console.log('user created in db');
              res.status(200).send({ message: 'user created' });
            });
        });
      });
    }
  })(req, res, next);
}

module.exports.deleteUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      res.status(403).send(info.message);
    } else {
      User.remove({
        username: req.query.username,
      }).then((userInfo) => {
        if (userInfo) {
          console.log('user deleted from db');
          res.status(200).send('user deleted from db');
        } else {
          console.error('user not found in db');
          res.status(404).send('no user with that username to delete');
        }
      }).catch((error) => {
        console.error('problem communicating with db');
        res.status(500).send(error);
      });
    }
  })(req, res, next);
}

module.exports.findUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log(err);
    }
    if (info !== undefined) {
      console.log(info.message);
      res.status(401).send(info.message);
    } else {
      console.log('user found in db from route');
      res.status(200).send({
        auth: true,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        username: user.username,
        password: user.password,
        message: 'user found in db',
      });
    }
  })(req, res, next);
}

module.exports.forgotPassword = (req, res) => {
  if (req.body.email === '') {
    res.status(400).send('email required');
  }
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user === null) {
      console.error('email not in database');
      res.status(403).send('email not in db');
    } else {
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000;
      user.save();
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: 'no-reply@selfiewithfame.com',
        to: `${user.email}`,
        subject: 'Link To Reset Password',
        text:
          'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
          + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
          + `http://localhost:3000/reset/${token}\n\n`
          + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.error('there was an error: ', err);
          res.status(500).send(err);
        } else {
          res.status(200).json('recovery email sent');
        }
      });
    };
  });
}

module.exports.resetPassword = (req, res) => {
  User.findOne({
    resetPasswordToken: req.query.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    }
  }).then((user) => {
    console.log(user);
    if (user === null) {
      res.status(403).send('password reset link is invalid or has expired');
    } else {
      res.status(200).send({
        username: user.username,
        message: 'Password successfully reset',
      });
    }
  });
}

module.exports.updatePassword = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      console.error(info.message);
      res.status(403).send(info.message);
      return;
    }
    User.findOne({
      username: req.body.username,
    }).then((user) => {
      if (user === null) {
        console.error('no user exists in db to update');
        res.status(404).json('no user exists in db to update');
        return;
      }
      bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
          res.status(500).json('error hashing password');
          return;
        }
        user.password = hashedPassword;
        user.save().then(() => {
          res.status(200).send({
            auth: true,
            message: 'password updated'
          });
        });
      });
    });
  })(req, res, next);
}

module.exports.updatePasswordViaEmail = (req, res) => {
  User.findOne({
    username: req.body.username,
    resetPasswordToken: req.body.resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  }).then(user => {
    if (user == null) {
      res.status(403).send('password reset link is invalid or has expired');
    } else if (user != null) {
      bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json('error hashing password');
        }
        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        user.save().then(() => {
          res.status(200).send({ message: 'password updated' });
        });
      });
    } else {
      res.status(401).json('no user exists in db to update');
    }
  });
}

module.exports.updateUser = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.error(err);
    }
    if (info !== undefined) {
      res.status(403).send(info.message);
      return;
    }
    User.findOne({
      username: req.body.username,
    }).then((userInfo) => {
      if (userInfo != null) {
        userInfo.update({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: req.body.email,
        }).then(() => {
          res.status(200).send({
            auth: true,
            message: 'user updated'
          });
        });
      } else {
        res.status(401).send('no user exists in db to update');
      }
    });
  })(req, res, next);
}

module.exports.followUser = (req, res, next) => {
  const username = req.params.username;
  User.findOne({ username })
    .then((userToFollow) => {
      if (!userToFollow) {
        return res.send(404).send('User not found');
      }
      if (userToFollow._id.equals(req.user._id)) {
        return res.status(500).send('Cannot follow self');
      }
      User.findById(req.user._id)
        .then((currentUser) => {
          if (currentUser.following.indexOf(userToFollow._id) === -1 || userToFollow.followers.indexOf(currentUser._id) === -1) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            // Save
            currentUser.save().then(() => {
              userToFollow.save().then(() => {
                return res.status(200).send('successfully followed');
              });
            });
          } else {
            return res.status(409).send('already following');
          }
        });
    });
}

module.exports.unfollowUser = (req, res, next) => {
  const username = req.params.username;

  User.findOne({ username })
    .then(userToUnfollow => {
      // exists
      if (!userToUnfollow) {
        return res.send(404).send('User not found');
      }
      // self
      if (userToUnfollow._id.equals(req.user._id)) {
        return res.status(500).send('Cannot unfollow self');
      }
      // Unfollow them
      User.findById(req.user._id)
        .then((currentUser) => {
          // are we even following them?
          if (currentUser.following.indexOf(userToUnfollow._id) === -1) {
            return res.status(500).send('Cannot unfollow someone we are not following');
          }
          currentUser.following = currentUser.following.filter((val, idx, arr) => {
            return !val.equals(userToUnfollow._id);
          });
          userToUnfollow.followers = userToUnfollow.followers.filter((val, idx, arr) => {
            return !val.equals(currentUser._id);
          });
          // Save
          currentUser.save().then(() => {
            userToUnfollow.save().then(() => {
              return res.status(200).send('succesfully unfollowed');
            });
          });
        });
    });
}

module.exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  User.findOne({ username })
    .populate('followers', 'first_name last_name username')
    .populate('following', 'first_name last_name username')
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.send(user);
    });
}

module.exports.getAll = (req, res, next) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  const query = {}

  User.find(query, {}, pagination)
    .populate('followers', 'first_name last_name username')
    .populate('following', 'first_name last_name username')
    .then((users) => {
      res.status(200).send({
        users
      });
    });
}
