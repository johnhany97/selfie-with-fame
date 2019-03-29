const passport = require('passport');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

var Event = require('../models/event');

const BCRYPT_SALT_ROUNDS = 12;


// module.exports.createEvent = (req, res, next) => {
//   const event_name = req.body.event_name;
//   const information = req.body.information;
//   const date_time = req.body.date_time;
//   const location = req.body.location;
//   if (!event_name || !information || !email || !date_time || !location) {
//     res.send('Missing parameters')
//     return;
//   }
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) {
//       console.log(err);
//     }
//     if (info !== undefined) {
//       console.log(info.message);
//       res.status(401).send(info.message);
//     } else {
//       console.log('user found in db from route');
//       Event.create({ event_name: event_name, information: information, date_time: date_time, location: location}).then(event => {
//         console.log('event created');
//         // note the return needed with passport local - remove this return for passport JWT to work
//         //return done(null, event);
//         res.status(200).send({ message: 'event created' });
//       });
//     }
//   })(req, res, next);
// }


module.exports.createEvent = (req, res, next) => {
    const event = new Event({
        event_name = req.body.event_name,
        information = req.body.information,
        date_time = req.body.date_time,
        location = req.body.location
    });
  
    event.save()
      .then((event) => {
        res.send(event);
      })
      .catch((e) => {
        res.status(400).send(e);
      });
  }

module.exports.getStory = (req, res, next) => {
    res.status(500).send('Not implemented yet');
}
  
module.exports.deleteStory = (req, res, next) => {
    res.status(500).send('Not implemented yet');
}

// module.exports.findUser = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) {
//       console.log(err);
//     }
//     if (info !== undefined) {
//       console.log(info.message);
//       res.status(401).send(info.message);
//     } else {
//       console.log('user found in db from route');
//       res.status(200).send({
//         auth: true,
//         first_name: user.first_name,
//         last_name: user.last_name,
//         email: user.email,
//         username: user.username,
//         password: user.password,
//         message: 'user found in db',
//       });
//     }
//   })(req, res, next);
// }

// module.exports.forgotPassword = (req, res) => {
//   if (req.body.email === '') {
//     res.status(400).send('email required');
//   }
//   User.findOne({
//     email: req.body.email,
//   }).then((user) => {
//     if (user === null) {
//       console.error('email not in database');
//       res.status(403).send('email not in db');
//     } else {
//       const token = crypto.randomBytes(20).toString('hex');
//       user.resetPasswordToken = token;
//       user.resetPasswordExpires = Date.now() + 360000;
//       user.save();
//       const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//           user: `${process.env.EMAIL_ADDRESS}`,
//           pass: `${process.env.EMAIL_PASSWORD}`,
//         },
//       });

//       const mailOptions = {
//         from: 'no-reply@selfiewithfame.com',
//         to: `${user.email}`,
//         subject: 'Link To Reset Password',
//         text:
//           'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n'
//           + 'Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n'
//           + `http://localhost:3000/reset/${token}\n\n`
//           + 'If you did not request this, please ignore this email and your password will remain unchanged.\n',
//       };

//       transporter.sendMail(mailOptions, (err, response) => {
//         if (err) {
//           console.error('there was an error: ', err);
//           res.status(500).send(err);
//         } else {
//           res.status(200).json('recovery email sent');
//         }
//       });
//     };
//   });
// }

// module.exports.resetPassword = (req, res) => {
//   User.findOne({
//     resetPasswordToken: req.query.resetPasswordToken,
//     resetPasswordExpires: {
//       $gt: Date.now(),
//     }
//   }).then((user) => {
//     console.log(user);
//     if (user === null) {
//       res.status(403).send('password reset link is invalid or has expired');
//     } else {
//       res.status(200).send({
//         username: user.username,
//         message: 'Password successfully reset',
//       });
//     }
//   });
// }

// module.exports.updatePassword = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) {
//       console.error(err);
//     }
//     if (info !== undefined) {
//       console.error(info.message);
//       res.status(403).send(info.message);
//       return;
//     }
//     User.findOne({
//       username: req.body.username,
//     }).then((user) => {
//       if (user === null) {
//         console.error('no user exists in db to update');
//         res.status(404).json('no user exists in db to update');
//         return;
//       }
//       bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
//         user.password = hashedPassword;
//         user.save();
//       }).then(() => {
//         res.status(200).send({
//           auth: true,
//           message: 'password updated'
//         });
//       });
//     });
//   })(req, res, next);
// }

// module.exports.updatePasswordViaEmail = (req, res) => {
//   User.findOne({
//     username: req.body.username,
//     resetPasswordToken: req.body.resetPasswordToken,
//     resetPasswordExpires: {
//       $gt: Date.now(),
//     },
//   }).then(user => {
//     if (user == null) {
//       res.status(403).send('password reset link is invalid or has expired');
//     } else if (user != null) {
//       bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
//         user.password = hashedPassword;
//         user.resetPasswordToken = null;
//         user.resetPasswordExpires = null;
//         user.save();
//       }).then(() => {
//         res.status(200).send({ message: 'password updated' });
//       });
//     } else {
//       res.status(401).json('no user exists in db to update');
//     }
//   });
// }

// module.exports.updateUser = (req, res, next) => {
//   passport.authenticate('jwt', { session: false }, (err, user, info) => {
//     if (err) {
//       console.error(err);
//     }
//     if (info !== undefined) {
//       res.status(403).send(info.message);
//       return;
//     }
//     User.findOne({
//       username: req.body.username,
//     }).then((userInfo) => {
//       if (userInfo != null) {
//         userInfo.update({
//           first_name: req.body.first_name,
//           last_name: req.body.last_name,
//           email: req.body.email,
//         }).then(() => {
//           res.status(200).send({
//             auth: true,
//             message: 'user updated'
//           });
//         });
//       } else {
//         res.status(401).send('no user exists in db to update');
//       }
//     });
//   })(req, res, next);
// }
