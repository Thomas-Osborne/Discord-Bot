const { Schema, model } = require('mongoose');

const petSchema = new Schema({
    messageId: {
        type: String,
        required: true,
    }, 
    guildId: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
})

module.exports = model('Pet', petSchema);