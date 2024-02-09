const { Schema, model } = require('mongoose');

const reactionSchema = new Schema({
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
    }
})

module.exports = model('Wealth', wealthSchema);