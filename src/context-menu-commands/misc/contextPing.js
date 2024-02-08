const { Client, Interaction } = require('discord.js');

/**
* @param {Client} client
* @param {Interaction} interaction
* 
*/

module.exports = (client, interaction) => {
    interaction.reply(`Pong from the menu! ${client.ws.ping}ms`)
}