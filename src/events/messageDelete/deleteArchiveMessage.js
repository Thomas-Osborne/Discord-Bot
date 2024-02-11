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

        if (!archivedMessage) {
            return;
        }

        const author = await Person.findOne({ userId: archivedMessage.authorId });
            author.messagesArchived.pull(archivedMessage._id);
            author.save()
                .catch(error => console.error(`Error updating author when deleting archived message: ${error}`));

        const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

        const archiveListChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID);

        const messageList = await archiveListChannel.messages.fetch({ limit: 100 })

        for (const message of messageList) {
            if (message[1].content.includes(url)) {
                let regex = new RegExp(`\\[([^\\[\\]]+)\\]\\(${url}\\)\\n?`);
                message[1].edit(message[1].content.replace(regex, ''));
                break;
            } else {
                return;
            }
        }

        const archiveChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID);

        const archiveMessages = await archiveChannel.messages.fetch({ limit: 100 });

        for (const message of archiveMessages) {
            if (message[1].embeds) {
                for (embed of message[1].embeds) {
                    if (embed.url === url) {
                        console.log("I'm in here!");
                        console.log(message[1]);
                        message[1].delete();
                        break;
                    }
                }
            }
        }

        return;        

    } catch (error) {
        console.error(`Error deleting archived message entry: ${error}`)
    }
}