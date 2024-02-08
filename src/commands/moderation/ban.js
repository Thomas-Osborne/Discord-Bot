const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    deleted: true,
    name: 'ban',
    description: 'Bans a member from the server!',
    devOnly: true,
    options: [
        {
            name: 'target-user',
            description: 'The user to ban.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'The reason for the ban.',
            type: ApplicationCommandOptionType.String,
        },
    ],
    permissionsRequired: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    callback: (client, interaction) => {
        interaction.reply('Ban...')
    }
}