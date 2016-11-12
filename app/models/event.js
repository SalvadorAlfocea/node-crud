// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


/***** CREATE A SCHEMA **********************************/

const eventSchema = new Schema({
	name: String,
	slug: {
		type: String,
		unique: true,
		lowercase: true
	},
	description: String,
	created: {
		type: Date,
		default: Date.now()
		// select: false ==> significa que por defecto no devuelve este campo. 
		// Recomendado para datos sensibles, como por ejemplo una contraseña.
	} 
});


/***** MIDDLEWARE ***************************************/

// Make sure that the slug is created from the name
eventSchema.pre('save', function(next) { // esta función se dispara antes de ejecutar el evento 'save'.
	this.slug = slugify(this.name);
	next();
});


/***** METHODS ******************************************/

eventSchema.methods.speak = function () {
  	var greeting = this.name
    	? "Meow name is " + this.name
    	: "I don't have a name";
  	
  	console.log(greeting);

  	/*
		How to use:

		var event = new Event({ name: 'fluffy' });
		event.speak(); // "Meow name is fluffy"

		event.save(function (err, r_event) {
		  	if (err) return console.error(err);
		  	r_event.speak();
		});
  	*/
}


/***** CREATE THE MODEL *********************************/

const eventModel = mongoose.model('Event', eventSchema);


/***** EXPORT THE MODEL *********************************/

module.exports = eventModel;


/***** FUNCTIONS ****************************************/

// Slugify a name
function slugify(text) {
	return text.toString().toLowerCase()
    	.replace(/\s+/g, '-')           // Replace spaces with -
    	.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    	.replace(/\-\-+/g, '-')         // Replace multiple - with single -
    	.replace(/^-+/, '')             // Trim - from start of text
    	.replace(/-+$/, '');            // Trim - from end of text
}