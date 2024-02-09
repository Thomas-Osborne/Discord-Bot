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
    messageId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    authorId: {
        type: String,
        required: true,
    },
    authorIsBot: {
        type: Boolean,
        required: true,
    },
    // reacterId: {
    //     type: String,
    //     requried: true,
    // },
    // selfReact: {
    //     type: Boolean,
    //     required: true,
    // },
})

module.exports = model('Reaction', reactionSchema);