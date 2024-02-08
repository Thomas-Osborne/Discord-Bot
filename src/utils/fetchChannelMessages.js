const { Client, Channel } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {Channel} channel
 */
module.exports = async (client, channel, limit) => {
    const messages = await channel.messages.fetch({ limit: 100 });
    return messages;
}