const { Client, ModalBuilder } = require('discord.js');

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    try {
        const modal = new ModalBuilder()
            .setCustomId(`archiveModal`)
            .setTitle('Add to Archives');
        const archiveNameInput = new TextInputBuilder()
            .setCustomId('archiveNameInput')
            .setLabel('Name the Archive Entry')
            .setStyle(TextInputStyle.Short);
        const firstActionRow = new ActionRowBuilder().addComponents(archiveNameInput);
        modal.addComponents(firstActionRow);
        return modal;
    } catch (error) {
        console.error(`Error building modal: ${error}`);
    }
}