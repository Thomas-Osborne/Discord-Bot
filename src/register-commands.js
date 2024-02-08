require('dotenv').config();
const { REST, Routes, ContextMenuCommandBuilder, SlashCommandBuilder, ApplicationCommandType } = require('discord.js');

const commands = [
    new ContextMenuCommandBuilder()
        .setName('Add to Archives')
        .setType(ApplicationCommandType.Message),
];

const rest = new REST().setToken(process.env.TOKEN);


(async () => {
    try {
        console.log('Registering commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {
                body: commands
            }
        )
        
        console.log('Commands registered.');
    } catch (error) {
        console.log(`Error: ${error}`);
    }
})();