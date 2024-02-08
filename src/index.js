require('dotenv').config();
const eventHandler = require('./handlers/eventHandler')

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

// let archiveNameValue;

// client.on('ready', (c) => {
//     console.log(`${c.user.username} is online!`);
// })

// client.on(Events.InteractionCreate, async (interaction) => {
//     if (!(interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand)) {
//         return;
//     }

//     if (interaction.commandName === 'Add to Archives') {
//         if (interaction.targetMessage.author.bot) {
//             interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
//         } else if (interaction.targetMessage.author.id === interaction.member.id) {
//             interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
//         } else {
//             const modal = buildModal(interaction);
//             await interaction.showModal(modal);

//             const filter = (interaction) => interaction.customId === 'archiveModal';

//             interaction
//                 .awaitModalSubmit( {filter, time: 15_000} )
//                 .then(async (modalInteraction) => {
//                     archiveNameValue = modalInteraction.fields.getTextInputValue('archiveNameInput');
//                     if (await canArchive(interaction.targetMessage)) {
//                         const url = await addToArchives(interaction.targetMessage, interaction.member.displayName, archiveNameValue);
//                         interaction.targetMessage.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.author.id}>'s message!\n\n_See the [archive entry](<${url}>)._`);
//                     } else {
//                         interaction.targetMessage.reply( { content: `<@${interaction.member.id}>, this message has already been added to the archives.`, ephemeral: true })
//                     }
//                     modalInteraction.deferUpdate();
//                 })
//                 .catch(error => {
//                     console.log(`Error: ${error}`);
//                 })
//         }        
//     }
// })


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