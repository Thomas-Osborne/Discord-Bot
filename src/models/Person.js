const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');

const personSchema = new Schema({
    userId: {
        type: String,
        required: true,
    }, 
    guildId: {
        type: String,
        required: true,
    },
    money: {
        type: Number,
        default: 0,
    },
    reactionsReceived: [{
        type: Schema.Types.ObjectId,
        ref: Reaction,
        default: [],
    }],
    reactionsSent: [{
        type: Schema.Types.ObjectId,
        ref: Reaction,
        default: [],
    }],
})

module.exports = model('Person', personSchema);