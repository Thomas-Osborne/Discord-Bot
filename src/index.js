require('dotenv').config();
const eventHandler = require('./handlers/eventHandler');
const addToArchivesContextMenu = require('./context-menu-commands/archives/AddToArchives.js');
const pingContextMenu = require('./context-menu-commands/misc/contextPing.js');


const { Client, Events, IntentsBitField, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.Reaction,
    ]
});

eventHandler(client);

client.login(process.env.TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
    if (!(interaction.isMessageContextMenuCommand)) {
        return;
    }

    if (interaction.commandName === 'Add to Archives') {
        addToArchivesContextMenu(client, interaction);
    }

    if (interaction.commandName === 'Context Ping!') {
        pingContextMenu(client, interaction);
    }

});
