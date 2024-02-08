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

client.login(process.env.TOKEN);

eventHandler(client);

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


// client.on(Events.InteractionCreate, async (interaction) => {
//         if (interaction.targetMessage.author.bot) {
//             interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
//         } else if (interaction.targetMessage.author.id === interaction.member.id) {
//             interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
//         } else {
//             const modal = buildModal(interaction);
//             await interaction.showModal(modal);



// function buildModal() {
//     const modal = new ModalBuilder()
//         .setCustomId(`archiveModal`)
//         .setTitle('Add to Archives');
//     const archiveNameInput = new TextInputBuilder()
//         .setCustomId('archiveNameInput')
//         .setLabel('Name the Archive Entry')
//         .setStyle(TextInputStyle.Short);
//     const firstActionRow = new ActionRowBuilder().addComponents(archiveNameInput);
//     modal.addComponents(firstActionRow);
//     return modal;
// }