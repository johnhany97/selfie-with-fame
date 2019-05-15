const passport = require('passport');
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
    name: req.body.name,
    information: req.body.information,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location: {"coordinates": req.body.location, "city": req.body.city}
  });

  event.save()
    .then((event) => {
      //res.send(event);
      res.status(200).send({ message: 'event created', event_id: event._id });

    })
    .catch((e) => {
      res.status(400).send(e);
    });
}

module.exports.getStory = (req, res, next) => {
  res.status(500).send('Not implemented yet');
}


module.exports.deleteEvent = (req, res, next) => {
  console.log("ATTEMPTED TO DELETE EVENT WITH ID" + req.query._id);
  Event.remove({
    _id: req.query._id,
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


module.exports.findEvent = (req, res, next) => {
  Event.findOne({
    _id: req.query._id,
  }).then((event) => {
    if (event != null) {
      res.status(200).send(
        event
      );
    } else {
      res.status(401).send('no event exists in db to find');
    }
  });
}


module.exports.getEventsByLocation = (req, res, next) => {

  const query = { 'location.city': req.body.city };

  Event.find(query)
    .sort({ createdAt: -1 })
    .then((events) => {
      res.status(200).send({
        events
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

module.exports.updateEvent = (req, res, next) => {
  Event.findOne({
    _id: req.body._id,
  }).then((eventInfo) => {
    if (eventInfo != null) {
      eventInfo.update({
        name: req.body.event_name,
        information: req.body.information,
        start_date: req.body.date_time,
        end_date: req.body.date_time,
        location: req.body.location
      }).then(() => {
        res.status(200).send({
          message: 'event updated'
        });
      });
    } else {
      res.status(401).send('no event exists in db to update');
    }
  });
}