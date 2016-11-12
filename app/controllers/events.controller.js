// Import the event model
const Event = require('../models/event');

module.exports = {
	showEvents: 	showEvents,
	showSingle: 	showSingle,
	seedEvents: 	seedEvents,
	showCreate: 	showCreate,
	processCreate: 	processCreate,
	showEdit: 		showEdit,
	processEdit: 	processEdit,
	deleteEvent: 	deleteEvent
}

/**
 * Show all events
 *
 * @author Koalix
 */
function showEvents(req, res) {
	// Get all events
	Event.find({}, function(err, events) 
	{
		if (err || events.length == 0) {
			// Return not found status
			res.status(404).send();
		} else {
			// Return a view with data
			res.status(200).render('pages/events', { events });
		}
	});
}

/**
 * Show a single event
 */
function showSingle(req, res) {

	var slug = req.params.slug;

	Event.findOne({'slug': slug}, function(err, event) 
	{
		if (err) 
		{
			console.log(`[ERROR] events.controller.js (showSingle): \n ${err}`);
			res.status(404).send();
		}
		else
		{
			res.status(200).render('pages/single', { event: event });
		}
	});
}

/**
 * Seed the database
 */
function seedEvents(req, res) {
	
	// Create some events
	const events = [
		{ name: 'Basketball', description: 'Throwing into a basket.' },
		{ name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
		{ name: 'Weight Lifting', description: 'Lifting heavy things up.' },
		{ name: 'Ping Pong', description: 'Super fast paddles' }
	]

	// Use the Event model to insert/save
	Event.remove({}, function() {
	   
	   	for (event of events) {
    		var newEvent = new Event(event);
    		newEvent.save();
    	}

	});

	// Seed!
	res.status(200).send({ message: 'Database seeded!' });
}

/**
 * Show the create form
 */
function showCreate(req, res) {
	res.status(200).render('pages/create');
}

/**
 * Process the create form
 */
function processCreate(req, res) {
	// Validate params
	req.checkBody('name', 'Name is required.').notEmpty();
	req.checkBody('description', 'Description is required.').notEmpty();

	// if there are errors, redirect and save errors to flash
	const errors = req.validationErrors();
	if (errors) return res.status(301).redirect('/events/create');

	// create a new event
	const event = new Event({
		name: req.body.name,
		description: req.body.description
	});

	// save event
	event.save(function(err) {
		if (err) throw err;

		// redirect to the newly created event
		res.status(301).redirect(`/events/${event.slug}`);
	});
}

/**
 * Show the edit form
 */
function showEdit(req, res) {
	// Get slug
	var slug = req.params.slug;
	// Find in database 
	Event.findOne({'slug': slug}, function(err, event) {
		// return message
		if (err) {
			res.status(404).send({ message: 'Event not found!' });
		}
		else {
			res.status(200).render('pages/edit', { event });
		}
	});
}

/**
 * Process the edit form
 */
function processEdit(req, res) {
	// Validate params => https://github.com/ctavan/express-validator
	req.checkBody('name', 'Name is required.').notEmpty();
	req.checkBody('description', 'Description is required.').notEmpty();

	// if there are errors, redirect and save errors to flash
	const errors = req.validationErrors();

	if (errors) {
		console.log(`[data_validation_failured] events.controller.js (processEdit) =>\n${errors}`);
		return res.status(400).redirect(`/events/${req.params.slug}/edit`);
	}

	// finding a current event
	let slug = req.params.slug,
		update = req.body;

	// function to find the current event
	Event.findOneAndUpdate({ slug: slug }, update, function (err, r_event) {
		
		if (err) {
			console.log(`[failured_validation_data] events.controller.js (processEdit) =>\n${errors}`);
			return res.status(500).send('Oh, an error has been occurred!!');
		} else {
			return res.status(301).redirect(`/events/${r_event.slug}/edit`);
		}	
	});
}

/**
 * Delete an Event
 */
function deleteEvent(req, res) {

	let slug = req.params.slug;

	// find the user with id 4
	Event.findOneAndRemove({ slug: slug }, function(err) {
	  	if (err) throw err;

	  	return res.status(301).redirect('/events/');

	  	// we have deleted the user
	  	console.log('Event deleted!');
	});
}