const { Client, Message } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = (client, message) => {
    try {
        if (message.content === 'hello') {
            message.reply('Hi there!');
        }
    } catch (error) {
        console.log(`Error saying hi: ${error}`);
    }
}
