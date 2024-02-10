const { Schema, model } = require('mongoose');
const Reaction = require('./Reaction');
const Message = require('./Message');

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
    messagesArchived: [{
        type: Schema.Types.ObjectId,
        ref: Message,
        default: [],
    }]
})

module.exports = model('Person', personSchema);