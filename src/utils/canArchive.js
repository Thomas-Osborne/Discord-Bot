const { Client, Message } = require('discord.js');
const fetchChannelMessages = require('./fetchChannelMessages');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    let truthVal = true;
    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

    const archiveListChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID);
    await fetchChannelMessages(client, archiveListChannel, 100)
        .then(messages => {
            for (const message of messages) {
                if (message[1].content.includes(url)) {
                    truthVal = false;
                    break;
                }
            }
        })

    return truthVal;
}