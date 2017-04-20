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
	} 
});

/***** MIDDLEWARE ***************************************/

eventSchema.pre('save', function(next) {
	this.slug = slugify(this.name);
	next();
});

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
