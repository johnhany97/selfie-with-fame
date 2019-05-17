const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sanitizeHtml = require('sanitize-html');

const User = require('../models/user');
const Story = require('../models/story');
const NewsFeed = require('../models/newsfeed');

const BCRYPT_SALT_ROUNDS = 12;

/**
 * POST /api/users/login
 *
 * @summary
 * Login to the platform
 * 
 * @auth
 * Does not require authentication
 *
 * @param
 * - username => provided in the body, should be a string
 * - password => provided in the body, should be a string
 *
 * @returns:
 * - Status 200 if successfully logged in
 * - Status 400 if bad request
 * - Status 404 if story not found
 * - Status 500 if error with saving new story with like
 * If successful, it returns a JSON of the following format:
 * {
 *  auth: true,
 *  token: "SOME_TOKEN_THAT_SHOULD_BE_USED_BY_THE_CLIENT",
 *  message: "user found & logged in"
 * }
*/
module.exports.login = (req, res) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      return res.status(500).send(err)
    }
    if (info) {
      if (info.message === 'bad username') {
        return res.status(401).send(info.message);
      }
      return res.status(403).send(info.message);
    }
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
  })(req, res);
}

/**
 * POST /api/users/register
 *
 * @summary
 * Register on the platform
 *
 * @auth
 * Does not require authentication
 *
 * @param
 * - first_name => string   - First name
 * - last_name  => string   - Last name
 * - email      => string   - Email
 * - username   => string   - User name
 * - password   => string   - Password
 * - bio        => string   - Biography
 *
 * @returns:
 * - Status 201 if successfully registered
 * - Status 400 if bad request
 * - Status 500 if error registering
 * If successful, it returns a JSON of the following format:
 * {
 *  message: "user created"
 * }
*/
module.exports.register = (req, res) => {
  // Obtain parameters and sanitize them
  const first_name = sanitizeHtml(req.body.first_name);
  const last_name = sanitizeHtml(req.body.last_name);
  const email = sanitizeHtml(req.body.email);
  const username = sanitizeHtml(req.body.username);
  const bio = sanitizeHtml(req.body.bio);
  const password = req.body.password;
  // Validate they're there
  if (!first_name || !last_name || !email || !username || !password) {
    return res.status(400).send('Missing or invalid parameters');
  }
  // Start registering through passport
  passport.authenticate('register', (err, user, info) => {
    if (err) {
      return res.status(400).send(err);
    }
    if (info) { // Contains error (ex. username already taken)
      return res.status(500).send(info.message);
    }
    // Complete the puzzle by adding the rest
    // of the provided information to the user's db entry
    req.logIn(user, err => {
      User.findOne({ username })
        .then(user => {
          user
            .update({
              first_name,
              last_name,
              email,
              bio,
            })
            .then(() => {
              res.status(201).send({ message: 'user created' });
            });
        });
    });
  })(req, res);
}

/**
 * DELETE /api/users/:username
 * 
 * @todo
 * Switch to admin exclusive
 *
 * @summary
 * Delete a given user by their given username
 *
 * @auth
 * Requires signed in user
 *
 * @param
 * - username => String   - User name
 *
 * @returns:
 * - Status 202 if successfully deleted
 * - Status 400 if bad request
 * - Status 404 if user not found
 * - Status 500 if error with deleting user
*/
module.exports.deleteUser = (req, res) => {
  const username = sanitizeHtml(req.params.username);

  if (!username || username === '') {
    return res.status(400).send('invalid username');
  }

  User.remove({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('no user with that username to delete');
      }
      res.status(202).send('user deleted from db');
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * POST /api/users/forgotPassword
 *
 * @summary
 * Used to trigger a forgot my password workflow provided we have
 * the user's email provided in the body
 *
 * @auth
 * Does not require authenticated user
 *
 * @param
 * - email => String   - Email
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs with sending email or finding user in db
*/
module.exports.forgotPassword = (req, res) => {
  const email = sanitizeHtml(req.body.email);

  if (!email || email === '') {
    return res.status(400).send('email required');
  }

  User.findOne({ email })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send('user not found');
      }
      // Generate reset token
      const token = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 360000;
      await user.save();
      // Prepare email to send to user
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

      // Send the prepared email
      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send('recovery email sent');
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * PUT /api/users/reset
 *
 * @summary
 * Triggered when user clicks on the link provided in the 
 * forgot my password email to reset their password.
 *
 * @auth
 * Does not require authenticated user
 *
 * @param
 * - resetPasswordToken => String - Randomly generated token provided as query param
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs with sending email or finding user in db
*/
module.exports.resetPassword = (req, res) => {
  const resetPasswordToken = req.query.resetPasswordToken;

  User.findOne({
    resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    }
  })
    .then((user) => {
      if (!user) {
        return res.status(403).send('password reset link is invalid or has expired');
      }
      res.status(200).send({
        username: user.username,
        message: 'Password successfully reset',
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

/**
 * PUT /api/users/:username/password
 *
 * @summary
 * Used to update a user's password given their username
 *
 * @auth
 * Requires authenticated users
 *
 * @param
 * - username => String     - User name
 * - password => String     - Password
 * - bio        => string   - Biography
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs with hashing password or interacting with db
*/
module.exports.updatePassword = (req, res) => {
  const username = sanitizeHtml(req.params.username);

  const password = req.body.password;

  if (!username || !password || password === '') {
    return res.status(400).send('Invalid params');
  }

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('no user exists in db to update');
      }
      bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
          return res.status(500).send('error hashing password');
        }
        user.password = hashedPassword;
        user.save()
          .then(() => {
            res.status(200).send({
              auth: true,
              message: 'password updated'
            });
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * PUT /api/users/updatePasswordViaEmail
 *
 * @summary
 * Used to update the user's password through email rather than through profile
 *
 * @auth
 * Does not require authentication
 *
 * @param
 * - username => String     - User name
 * - password => String     - Password
 * - resetPasswordToken => String - Randomly generated token provided as query param
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs with hashing password or interacting with db
*/
module.exports.updatePasswordViaEmail = (req, res) => {
  const username = sanitizeHtml(req.body.username);
  const resetPasswordToken = req.body.resetPasswordToken;

  User.findOne({
    username,
    resetPasswordToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  })
    .then(user => {
      if (!user) {
        return res.status(403).send('password reset link is invalid or has expired');
      }
      bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
        if (err) {
          return res.status(500).ßjson('error hashing password');
        }
        // Update the password with the newly hashed password
        user.password = hashedPassword;
        // Reset reset password parameters
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        // Save changes
        user.save()
          .then(() => {
            res.status(200).send({ message: 'password updated' });
          })
          .catch((err) => {
            return res.status(500).send(err);
          });
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * PUT /api/users/:username
 *
 * @summary
 * Update the user's details
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - username => String     - User name
 * - password => String     - Password
 * - resetPasswordToken => String - Randomly generated token provided as query param
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs with hashing password or interacting with db
*/
module.exports.updateUser = (req, res) => {
  const username = sanitizeHtml(req.params.username);

  const first_name = sanitizeHtml(req.body.first_name);
  const last_name = sanitizeHtml(req.body.last_name);
  const email = sanitizeHtml(req.body.email);
  const bio = sanitizeHtml(req.body.bio);

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).send('user not found');
      }
      user.update({
        first_name,
        last_name,
        email,
        bio
      })
        .then(() => {
          res.status(200).send({
            auth: true,
            message: 'user updated'
          });
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * POST /api/users/:username/follow
 *
 * @summary
 * Follow the user with the provided username
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - username => String     - User name
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 409 if user tries to follow self or if already followed (conflict)
 * - Status 500 if an error occurs when interacting with the db
*/
module.exports.followUser = (req, res) => {
  const username = sanitizeHtml(req.params.username);
  
  if (!username || username === '') {
    return res.status(400).send('Invalid username');
  }

  User.findOne({ username })
    .then((userToFollow) => {
      if (!userToFollow) {
        return res.send(404).send('User not found');
      }
      if (userToFollow._id.equals(req.user._id)) {
        return res.status(409).send('Cannot follow self');
      }
      User.findById(req.user._id)
        .then((currentUser) => {
          if (currentUser.following.indexOf(userToFollow._id) === -1 && userToFollow.followers.indexOf(currentUser._id) === -1) {
            currentUser.following.push(userToFollow._id);
            userToFollow.followers.push(currentUser._id);
            // Save
            currentUser.save().then(() => {
              userToFollow.save().then(async () => {
                res.status(200).send('successfully followed');
                // Update their timeline
                // 1- Get all the user that we just followed's stories
                const userToFollowStories = await Story.find({postedBy: userToFollow._id});
                // 2- Add entries for them in the newsfeed
                let newsFeed = userToFollowStories.map((story) => {
                  return {
                    owner: currentUser._id,
                    story: story._id
                  };
                });
                // 3- Insert these entries in the db store
                await NewsFeed.insertMany(newsFeed);
              });
            });
          } else {
            return res.status(409).send('already following');
          }
        });
    });
}

/**
 * POST /api/users/:username/unfollow
 *
 * @summary
 * Unfollow the user with the provided username
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - username => String     - User name
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 409 if user tries to unfollow self or if already not following (conflict)
 * - Status 500 if an error occurs when interacting with the db
*/
module.exports.unfollowUser = (req, res) => {
  const username = req.params.username;

  User.findOne({ username })
    .then(userToUnfollow => {
      // exists
      if (!userToUnfollow) {
        return res.send(404).send('User not found');
      }
      // self
      if (userToUnfollow._id.equals(req.user._id)) {
        return res.status(409).send('Cannot unfollow self');
      }
      // Unfollow them
      User.findById(req.user._id)
        .then((currentUser) => {
          // are we even following them?
          if (currentUser.following.indexOf(userToUnfollow._id) === -1) {
            return res.status(409).send('Cannot unfollow someone we are not following');
          }
          // Filter down the following and followers lists
          currentUser.following = currentUser.following.filter((val, idx, arr) => {
            return !val.equals(userToUnfollow._id);
          });
          userToUnfollow.followers = userToUnfollow.followers.filter((val, idx, arr) => {
            return !val.equals(currentUser._id);
          });
          // Save
          currentUser.save().then(() => {
            userToUnfollow.save().then(async () => {
              res.status(200).send('succesfully unfollowed');
              // Remove all their stories from the current user's timeline
              const unfollowedUserStories = await Story.find({postedBy: userToUnfollow._id});
              // 1- remove every entry from the news feed store
              unfollowedUserStories.forEach(async (story) => {
                await NewsFeed.remove({
                  owner: currentUser._id,
                  story: story._id
                });
              });
            });
          });
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    });
}

/**
 * GET /api/users/:username
 *
 * @summary
 * Get a user by their username
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - username => String     - User name
 *
 * @returns:
 * - Status 200 if successful
 * - Status 400 if invalid parameters
 * - Status 404 if user not found
 * - Status 500 if an error occurs when interacting with the db
*/
module.exports.getUserByUsername = (req, res) => {
  const username = sanitizeHtml(req.params.username);

  if (!username || username === '') {
    return res.status(400).send('invalid parameters');
  }

  User.findOne({ username })
    .populate('followers', 'first_name last_name username')
    .populate('following', 'first_name last_name username')
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * GET /api/users/me
 *
 * @summary
 * Gets current user using their token
 *
 * @auth
 * Requires authentication
 *
 * @returns:
 * - Status 200 if successful
 * - Status 500 if an error occurs when interacting with the db
*/
module.exports.me = (req, res) => {
  User.findById(req.user._id)
    .populate('followers', 'first_name last_name username')
    .populate('following', 'first_name last_name username')
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}

/**
 * GET /api/users
 *
 * @summary
 * Get all users
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - size => Number   - number of users / page (Default: 10)
 * - page => Number   - which page we're at (Default: 1)
 *
 * @returns:
 * - Status 200 if successful
 * - Status 500 if an error occurs when interacting with the db
*/
module.exports.getAll = (req, res) => {
  const size = req.query.size || 10;
  const page = req.query.page || 1;

  const pagination = {
    limit: size * 1,
    skip: (page - 1) * size
  };

  const query = req.query;

  User.find(query, {}, pagination)
    .populate('followers', 'first_name last_name username')
    .populate('following', 'first_name last_name username')
    .then((users) => {
      return res.status(200).send({
        users
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    });
}


module.exports.getUserStories = async (req, res) => {
  const username = sanitizeHtml(req.params.username);

  const user = await User.findOne({username});
  
  if (!user) {
    return res.status(404).send('user not found');
  }

  Story.find({postedBy: user._id})
    .then((stories) => {
      res.status(200).send(stories);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}
