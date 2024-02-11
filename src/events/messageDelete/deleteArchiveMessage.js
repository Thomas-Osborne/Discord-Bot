require('dotenv').config();
const { Client, Message } = require('discord.js');
const Archive = require('../../models/Message');
const Person = require('../../models/Person');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    try {
        if (message.guild.id !== process.env.GUILD_ID) {
            return;
        }

        const archivedMessage = await Archive.findOneAndDelete({ messageId: message.id, channelId: message.channelId, guildId: message.guildId});

        console.log(archivedMessage);

        if (!archivedMessage) {
            return;
        }

        const author = await Person.findOne({ userId: archivedMessage.authorId });
            author.messagesArchived.pull(archivedMessage._id);
            author.save()
                .catch(error => console.error(`Error updating author when deleting pets: ${error}`));

        return;        

    } catch (error) {
        console.error(`Error deleting pet entry: ${error}`)
    }
}