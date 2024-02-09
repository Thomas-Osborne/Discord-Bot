const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'card',
    description: 'Returns details of a Hearthstone card by name.',
    options: [
        {
            name: 'card-name',
            description: 'The card you want details of.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: (client, interaction) => {
        interaction.reply('That is a card.');
    }
}