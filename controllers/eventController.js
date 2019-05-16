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

  //    location: {"coordinates": [req.body.location[0] + -.00004 * Math.cos((+a*i) / 180 * Math.PI),req.body.location[1]+ -.00004 * Math.cos((+a*i) / 180 * Math.PI)] "city": req.body.city}


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
  Event.remove({
    _id: req.query._id,
  }).then((eventInfo) => {
    if (eventInfo) {
      res.status(200).send('event deleted from db');
    } else {
      res.status(404).send('no event with that event_id to delete');
    }
  }).catch((error) => {
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


module.exports.getEventsByLocationAndDate = (req, res, next) => {

  // did an event either start or end in these times? e.g. was it ongoing at any point between these dates
  //so an event starts at DateA and ends on DateB. If it starts at any point in the range the user gave
  // return it. If it ends at any point in the range return it, as it was happening in this range. if it started before the userRangeStart
  //and ended after userRangeEnd include it as it was happeneing in this range.
  // if event  is  (userRangeStart <= eventStartDate <= userRangeEnd) OR (userRangeStart <= eventEndDate <= userRangeEnd)  OR
  // (eventStartDate <= userRangeStart AND eventEndDate >= userRangeEnd)
  let query = {
    $and:
    [
      {'location.city': req.body.city_displayEvents},
      {$or:
        [
          {$and:
            [
              {'start_date' :{$gte: req.body.start_date_displayEvents}}, 
              {'start_date' : {$lte: req.body.end_date_displayEvents}}
            ] 
          },

          {$and:
            [
              {'end_date' :{$gte: req.body.start_date_displayEvents}}, 
              {'end_date' : {$lte: req.body.end_date_displayEvents}}
            ] 
          },

          {$and:
            [
              {'start_date': {$lte: req.body.start_date_displayEvents}},
              {'end_date': {$gte: req.body.end_date_displayEvents}}
            ]
          }
        ]
      }
    ]
  };

  // let query = {
  //   $and:
  //   [
  //     {'location.city': req.body.city_displayEvents},
  //     {$or:
  //       [
  //         {'start_date': {$lte: req.body.start_date_displayEvents} },
  //         {'end_date': {$lte: req.body.end_date_displayEvents} },


  //       ]
  //     }
  //   ]
  // };

  // {
  //   $and : [
  //       { $or : [ { price : 0.99 }, { price : 1.99 } ] },
  //       { $or : [ { sale : true }, { qty : { $lt : 20 } } ] }
  //   ]

  // if (req.body.mode == "onGoing") {
  //    query = {
  //     'location.city': req.body.city_displayEvents,
  //     'start_date' : {$gte: req.body.start_date_displayEvents},
  //     'end_date' : {$gte: req.body.end_date_displayEvents},
  
  //   };
  // }

 

  // if (mode == "all") {
  //   query = {};
  // }
  // else if (mode == "allLocation") {
  //   query = {'location.city': req.body.city} 
  // }
  // else if (mode == "locationOngoing") {
  //   query = {
  //     'location.city': req.body.city,
  //     // 'startDate' : {$lte: today},
  //     'end_date': 
      
  //   } 
  //   console.log("location on going")

  // }
  // else if (mode == "locationLastWeek") {
  //   query = {
  //     'location.city': req.body.city,
  //     'start_date' : {$lte: today},
  //     'end_date': {$gte: lastWeek}
  //   } 

  // }

  // else if (mode == "locationSetDates") {
  //   query = {
  //     'location.city': req.body.city,
  //     'start_date' : req.body.startDate,
  //     'end_date': req.body.endDate
  //   } 

  // }
  // else {
  //   query = {};
  //   console.log("no match");

  // }

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