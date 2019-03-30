const passport = require('passport');
// const jwt = require('jsonwebtoken');
// const nodemailer = require('nodemailer');
// const crypto = require('crypto');
// const bcrypt = require('bcrypt');

var Event = require('../models/event');


module.exports.getEvents = (req, res, next) => {
  Event.find({})
    .sort({ createdAt: -1 })
    .then((events) => {
      res.status(200).send({
        events
      });
    });
}

module.exports.createEvent = (req, res, next) => {
  const event = new Event({
    event_name: req.body.event_name,
    information: req.body.information,
    date_time: req.body.date_time,
    location: req.body.location
  });

  event.save()
    .then((event) => {
      //res.send(event);
      res.status(200).send({ message: 'event created' });

    })
    .catch((e) => {
      res.status(400).send(e);
    });
}

module.exports.getStory = (req, res, next) => {
  res.status(500).send('Not implemented yet');
}


module.exports.deleteEvent = (req, res, next) => {
  console.log("ATTEMPTED TO DELETE EVENT")
  Event.remove({
    id: req.query.id,
  }).then((eventInfo) => {
    if (eventInfo) {
      console.log('event deleted from db');
      res.status(200).send('event deleted from db');
    } else {
      console.error('event not found in db');
      res.status(404).send('no event with that event_id to delete');
    }
  }).catch((error) => {
    console.error('problem communicating with db');
    res.status(500).send(error);
  });
}
