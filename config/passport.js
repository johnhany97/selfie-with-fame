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
      User.findOne({
        username: username,
      }).then(user => {
        if (user !== null) {
          console.log('username already taken');
          return done(null, false, { message: 'username already taken' });
        } else {
          bcrypt.hash(password, BCRYPT_SALT_ROUNDS, (err, hashedPassword) => {
            if (err) {
              return done(err);
            }
            User.create({ username, password: hashedPassword }).then(user => {
              return done(null, user);
            });
          });
        }
      }).catch(err => {
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
      User.findOne({
        username: username,
      }).then(user => {
        if (user === null) {
          return done(null, false, { message: 'bad username' });
        } else {
          bcrypt.compare(password, user.password, (err, res) => {
            if (!res) {
              return done(null, false, { message: 'passwords do not match' });
            }
            return done(null, user)
          });
        }
      }).catch(err => {
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
      //Pass the user details to the next middleware
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }),
);
