const { devs, testServer } = require('../../../config.json');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) {
        return;
    }

    const localCommands = getLocalCommands();

    try {
        const commandObject = localCommands.find(command => command.name === interaction.commandName);


        if (!commandObject) {
            return;
        }

        if (commandObject.devOnly) {
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({ content: 'Only developers are allowed to run this command.', ephemeral: true, })
                return;
            }
        }

        if (commandObject.testOnly) {
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({ content: 'This command can only be ran on a test server.', ephemeral: true, })
                return;
            }
        }

        // permission checking user
        if (commandObject.permissionsRequired?.length) { // optional chaining as might not exist
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({ content: 'Not enough permissions.', ephemeral: true, });
                    return;
                }
            }
        }

        // permission checking bot
        if (commandObject.botPermissions?.length) { // optional chaining as might not exist
            for (const permission of commandObject.botPermissions) {
                const bot = interaction.guild.members.me;
                if (!bot.permissions.has(permission)) {
                    interaction.reply({ content: 'I do not have enough permissions.', ephemeral: true, });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log(`Error running this command: ${error}`)
    }
};