const { Client, Interaction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const addToArchives = require('../../utils/addToArchives');
const canArchive = require('../../utils/canArchive');
const buildModal = require('../../utils/buildModal'); // TODO

/**
 * @param {Client} client
 * @param {Interaction} interaction
 */
module.exports = async (client, interaction) => {
    try {
        if (interaction.targetMessage.author.bot) {
            interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
        } else if (interaction.targetMessage.author.id === interaction.member.id) {
            interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
        } else {
            
            const modal = await buildModal(client);
            await interaction.showModal(modal);
            const filter = (interaction) => interaction.customId === 'archiveModal';

            interaction
                .awaitModalSubmit( {filter, time: 60_000} )
                .then(async (modalInteraction) => {
                    let archiveNameValue = modalInteraction.fields.getTextInputValue('archiveNameInput');
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
                    return;
                })
        }        
    } catch (error) {
    console.error(`Error with context menu interaction Add to Archives: ${error}`);
    }
}
    