require('dotenv').config();
const { Client, Message } = require('discord.js');
const Pet = require('../../models/Pet');
const Person = require('../../models/Person');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    try {
        if (message.guild.id !== process.env.GUILD_ID || message.channel.id !== process.env.CHANNEL_PETS_ID) {
            return;
        }

        if (!message.attachments) {
            return;
        }

        await Pet.deleteMany({ messageId: message.id, channelId: message.channelId, guildId: message.guildId});

        return;        

    } catch (error) {
        console.error(`Error deleting pet entry: ${error}`)
    }
}