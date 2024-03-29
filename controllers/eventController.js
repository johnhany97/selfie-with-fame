const passport = require('passport');
var Event = require('../models/event');
const validator = require('validator');


/**
 * GET '/api/events/getEvents'

 *
 * @summary
 * Gets all events and sorts them in reverse order of creation
 * 
 * @auth
 * Does require authentication
 *
 * @param
 * - none
 *
 * @returns:
 * - Status 200 if successfully got events
 * If successful, it returns a JSON of the following format:
 * {
 *  [Event]
 * }
*/


module.exports.getEvents = (req, res, next) => {
  Event.find({})
    .sort({ createdAt: -1 })
    .then((events) => {
      res.status(200).send({
        events
      });
    });
}

/**
 * POST '/api/events/createEvent
 *
 * @summary
 * Register on the platform
 *
 * @auth
 * Does require authentication 
 *
 * @param
 * - name => string   - name of event
 * - information  => string   - information
 * - start_date      => string   - start date of event
 * - end_date   => string   - end date of event
 * - location   => {string, /[float /]}   - a string with the city and an array of coordinates
 *
 * @returns:
 * - Status 20 if event created successfully
 * - Status 400 if bad request
 * If successful, it returns a JSON of the following format:
 * {
 *  message: "event created", event_id: event_id
 * }
*/

module.exports.createEvent = (req, res, next) => {
  const event = new Event({
    name: req.body.name,
    information: req.body.information,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    location: { "coordinates": req.body.location, "city": req.body.city }
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


/**
 * DELETE /api/events/:_id
 * 
 *
 * @summary
 * Deletes an event given its id
 *
 * @auth
 * Requires signed in user that created event or admin
 *
 * @param
 * - id => String   - event id
 *
 * @returns:
 * - Status 200 if successfully deleted
 * - Status 404 if event not found
 * - Status 500 if error with deleting event
*/

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


/**
 * GET /api/events/:_id
 *
 * @summary
 * Get an event by its id
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - id => String     - Event ID
 *
 * @returns:
 * - Status 200 if successfully found
 * - Status 401 if event not found
 * * If successful, it returns a JSON of the following format:
 * {
 *  Event
 * }
*/

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

/**
 * POST /api/events/getEventsByLocation
 *
 * @summary
 * Get an event by its city 
 *
 * @auth
 * Requires authentication
 *
 * @param

 * - query   => string  - a City
 *
 * @returns:
 * - Status 200 if successfully found
 * - Status 500 if error with finding events
 *  * * If successful, it returns a JSON of the following format:
 * {
 *  /[ Event/]
 * }
*/


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


/**
 * GET /api/events/getEventById
 *
 * @summary
 * Get an event by its id
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - id => String     - Event ID
 *
 * @returns:
 * - Status 200 if successfully found
 * - Status 400 if invalid id
 * - Status 500 if error with deleting event
 *  * * If successful, it returns a JSON of the following format:
 * {
 *  Event
 * }

*/
module.exports.getEventById = (req, res) => {
  const id = req.params.id;

  if (!validator.isMongoId(id)) {
    return res.status(400).send('invalid id');
  }

  Event.findById(id)
    .then((event) => {
      return res.status(200).send(event);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })


}
/**
 * POST '/api/events/getEventsByLocation
 *
 * @summary
 * get events based on a query
 *
 * @auth
 * Does require authentication 
 *
 * @param
 * - event query => string   - name of event or key word
 * - start_date      => string   - start date of event
 * - end_date   => string   - end date of event
 * - location   => city  - a string with the city 
 *
 * @returns:
 * - Status 200 if event created successfully
 * - Status 500 if bad request
 * If successful, it returns a JSON of the following format:
  * {
  *   /[ Event/]
  * }
*/

module.exports.getEventsByLocationAndDate = (req, res, next) => {

  // did an event either start or end in these times? e.g. was it ongoing at any point between these dates
  //so an event starts at DateA and ends on DateB. If it starts at any point in the range the user gave
  // return it. If it ends at any point in the range return it, as it was happening in this range. if it started before the userRangeStart
  //and ended after userRangeEnd include it as it was happeneing in this range.
  // if event  is  (userRangeStart <= eventStartDate <= userRangeEnd) OR (userRangeStart <= eventEndDate <= userRangeEnd)  OR
  // (eventStartDate <= userRangeStart AND eventEndDate >= userRangeEnd)
  // console.log(req.body);
  let or_query = [
    req.body.eventQuery !== '' ? { 'information':  {'$regex' : '.*' + req.body.eventQuery + '.*' }} : undefined,
    req.body.eventQuery !== '' ? { 'name':  {'$regex' : '.*' + req.body.eventQuery + '.*' }} : undefined,
  ];
  let or_query_temp = []
  for(let i of or_query) {
    i && or_query_temp.push(i);
  }
  let query = {
    $and:
      [
        or_query_temp.length > 0 ? {
          $or: or_query_temp
        } : undefined,
        req.body.city_displayEvents !== '' ? { 'location.city': req.body.city_displayEvents } : undefined,
        {
          $or:
            [
              {
                $and:
                  [
                    { 'start_date': { $gte: req.body.start_date_displayEvents } },
                    { 'start_date': { $lte: req.body.end_date_displayEvents } }
                  ]
              },

              {
                $and:
                  [
                    { 'end_date': { $gte: req.body.start_date_displayEvents } },
                    { 'end_date': { $lte: req.body.end_date_displayEvents } }
                  ]
              },

              {
                $and:
                  [
                    { 'start_date': { $lte: req.body.start_date_displayEvents } },
                    { 'end_date': { $gte: req.body.end_date_displayEvents } }
                  ]
              }
            ]
        }
      ]
  };
  let tempQuery = { $and: [] }
  for(let i of query.$and) {
    i && tempQuery.$and.push(i);
  }
  Event.find(tempQuery)
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


/**
 * PUT /api/events/update
 *
 * @summary
 * Update the user's details
 *
 * @auth
 * Requires authentication
 *
 * @param
 * - name => string   - name of event
 * - information  => string   - information
 * - start_date      => string   - start date of event
 * - end_date   => string   - end date of event
 * - location   => {string, /[float /]}   - a string with the city and an array of coordinates
 *
 * @returns:
 * - Status 200 if successful
 * - Status 401 if event not found in database
*/

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