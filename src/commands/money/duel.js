const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'duel',
    description: 'Duel a member from the server.',
    options: [
        {
            name: 'target-user',
            description: 'The user to duel.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'amount',
            description: 'Amount to wager.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    callback: (client, interaction) => {

        const amount = interaction.options.get('amount').value;
        const target = interaction.options.get('target-user').member; // useful to have the object as a guild member

        if (Math.random() < 0.5) {
            interaction.reply(`<@${interaction.member.id}> you win against <@${target.id}>! You double your wager to £${2 * amount}.`);
        } else {
            interaction.reply(`<@${interaction.member.id}> you win against <@${target.id}>! You lose your £${amount}.`);
        }
    }
}