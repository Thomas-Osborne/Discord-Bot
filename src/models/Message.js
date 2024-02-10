const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
    messageId: {
        type: String,
        required: true,
    }, 
    guildId: {
        type: String,
        required: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    imageUrl: {
        type: String,
        default: "",
    }
})

module.exports = model('Message', messageSchema);