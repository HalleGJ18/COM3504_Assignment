var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Schema for each chat message; chat messages are a nested document in a sighting
var chatMessagesSchema = new Schema(
    {
        chatMessage: {type: String },
        username: {type: String }
    }
)

// The Schema for the sighting
var SightingSchema = new Schema(
    {
        bird_name: {type: String, required: true, max: 100},
        date: {type: String, required: true, max: 100},
        location: {type: String, required: true, max: 100},
        description: {type: String, required: true, max: 100},
        addedBy: {type: String, max:100},
        img: {type: String },
            chatMessages: [chatMessagesSchema]
    }
);

SightingSchema.set('toObject', {getters: true, virtuals: true});

// creating a model that uses the schema
var Sighting = mongoose.model('Sighting', SightingSchema);

module.exports = Sighting;