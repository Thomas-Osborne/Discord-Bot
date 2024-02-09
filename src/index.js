require('dotenv').config();

const { Client, Events, IntentsBitField, Partials, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const mongoose = require('mongoose');

const eventHandler = require('./handlers/eventHandler');
const addToArchivesContextMenu = require('./context-menu-commands/archives/AddToArchives.js');
const pingContextMenu = require('./context-menu-commands/misc/contextPing.js');


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

(async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        eventHandler(client);
        client.login(process.env.TOKEN);
    } catch (error) {
        console.error(`Error connecting to DB: ${error}`);
    }
})();

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
