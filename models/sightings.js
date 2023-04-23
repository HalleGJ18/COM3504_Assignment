var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var chatMessagesSchema = new Schema(
    {
            chatMessage: {type: String },
            username: {type: String }
    }
)

var SightingSchema = new Schema(
    {
        bird_name: {type: String, required: true, max: 100},
        date: {type: String, required: true, max: 100},
        location: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        img: {type: String },
            chatMessages: [chatMessagesSchema]
    }
);

// Virtual for a character's age
/*SightingSchema.virtual('age')
    .get(function () {
        var currentDate = new Date().getFullYear();
        var result= currentDate - this.dob;
        return result;
    });
*/
SightingSchema.set('toObject', {getters: true, virtuals: true});

//On some combionations of Node and Mongoose only the following command works - in theory they should be equivalent
//CharacterSchema.set('toObject', {getters: true, virtuals: true});

// the schema is useless so far
// we need to create a model using it
var Sighting = mongoose.model('Sighting', SightingSchema);

// make this available to our users in our Node applications
module.exports = Sighting;