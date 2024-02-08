const { Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const addToArchives = require('../../utils/addToArchives');
const canArchive = require('../../utils/canArchive');
const buildModal = require('../../utils/buildModal');

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
    try {
        let archiveNameValue;
        if (interaction.targetMessage.author.bot) {
            interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
        } else if (interaction.targetMessage.author.id === interaction.member.id) {
            interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
        } else {
            
            // need to fix to replace this with buildModal
            const modal = new ModalBuilder()
                .setCustomId(`archiveModal`)
                .setTitle('Add to Archives');
            const archiveNameInput = new TextInputBuilder()
                .setCustomId('archiveNameInput')
                .setLabel('Name the Archive Entry')
                .setStyle(TextInputStyle.Short);
            const firstActionRow = new ActionRowBuilder().addComponents(archiveNameInput);
            modal.addComponents(firstActionRow);
            await interaction.showModal(modal);
            const filter = (interaction) => interaction.customId === 'archiveModal';

            interaction
                .awaitModalSubmit( {filter, time: 15_000} )
                .then(async (modalInteraction) => {
                    archiveNameValue = modalInteraction.fields.getTextInputValue('archiveNameInput');
                    if (await canArchive(client, interaction.targetMessage)) {
                        const url = await addToArchives(client, interaction.targetMessage, interaction.member.displayName, archiveNameValue);
                        interaction.targetMessage.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.author.id}>'s message!\n\n_See the [archive entry](<${url}>)._`);
                    } else {
                        interaction.targetMessage.reply( { content: `<@${interaction.member.id}>, this message has already been added to the archives.`, ephemeral: true })
                    }
                    modalInteraction.deferUpdate();
                })
                .catch(error => {
                    console.log(`Error with submitting modal: ${error}`);
                })
        }        
    } catch (error) {
    console.error(`Error with context menu interaction Add to Archives: ${error}`);
    }
}
    