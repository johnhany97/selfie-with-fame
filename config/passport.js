const bcrypt = require('bcryptjs');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const BCRYPT_SALT_ROUNDS = 12;

passport.use(
  'register',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (user) { // it already exists
            return done(null, false, { message: 'username already taken' });
          }
          // Hash the password
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
            if (err) { // Error hashing it
              return done(err);
            }
            // Create the user using the password
            User.create({ username, password: hashedPassword })
              .then(user => {
                return done(null, user);
              })
              .catch(err => {
                return done(err);
              });
          });
        })
        .catch(err => {
          return done(err);
        });
    },
  ),
);

passport.use(
  'login',
  new localStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      session: false,
    },
    (username, password, done) => {
      User.findOne({ username })
        .then(user => {
          if (!user) { // Not found, wrong username?
            return done(null, false, { message: 'bad username' });
          }
          // Compare hashed password with provided one
          bcrypt.compare(password, user.password, (err, res) => {
            if (err) { // something went wrong
              return done(err);
            }
            if (!res) { // user exists, password wrong
              return done(null, false, { message: 'passwords do not match' });
            }
            // yay, all went good
            return done(null, user);
          });
        })
        .catch(err => {
          return done(err);
        });
    },
  ),
);

const opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  'jwt',
  new JWTstrategy(opts, async (token, done) => {
    try {
      const user = await User.findOne({ username: token.id });
      if (!user) {
        return done(null, false, { message: 'User not found' });
      }
      // Pass the user details to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);
