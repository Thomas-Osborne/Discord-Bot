const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
    reactionId: {
        type: String,
    }, 
    name: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    }
})

module.exports = model('Reaction', reactionSchema);