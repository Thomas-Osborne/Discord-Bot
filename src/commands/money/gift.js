const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'gift',
    description: 'Give money to a member from the server.',
    devOnly: true,
    options: [
        {
            name: 'target-user',
            description: 'The user to give money to.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'amount',
            description: 'The amount of money to give to the user.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    callback: (client, interaction) => {

        const amount = interaction.options.get('amount').value;
        const target = interaction.options.get('target-user').member; // useful to have the object as a guild member


    }
}