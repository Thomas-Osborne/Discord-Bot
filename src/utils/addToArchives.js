const { Client, Message, User, EmbedBuilder } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {Message} message
 * @param {User} archiver
 */

module.exports = async (client, message, archiver, title) => {
    const MAX_DESC_LENGTH = 300; // max number of characters to show in a description

    const member = await message.guild.members.fetch(message.author.id); // need to be able to obtain guild member properties like name colour
    const archiveChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID);
    const archiveListChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID);
    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

    const embed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setTitle(title)
        .setURL(url)
        .setDescription(message.content.length < MAX_DESC_LENGTH ? message.content : `${message.content.slice(0, MAX_DESC_LENGTH - 5)}...`)
        .addFields(
            {name: 'Sent by', value: `${member.displayName}`, inline: true},
            {name: 'Archived by', value: `${archiver}`, inline: true},
            {name: 'Channel', value: `${client.channels.cache.get(message.channelId).name}`}
        )
        .setTimestamp(message.createdTimestamp)
        .setThumbnail(member.avatarURL() ?? member.user.avatarURL()
            ? member.avatarURL() ?? member.user.avatarURL() // use in-server avatar if exists
            : member.user.defaultAvatarURL // show default avatar if no avatar exists
        )
        
    const sentEmbed = await archiveChannel.send({ embeds: [embed]});
    const embedUrl = await sentEmbed.url;

    const date = new Date(message.createdTimestamp);
    const stringToSend = `[• ${date.toLocaleString().substring(0, date.toLocaleString().indexOf(','))} — ${member.displayName} — ${title}](${url})`;

    archiveListChannel.messages
        .fetch({ limit: 1 })
        .then(messages => {
            if (messages.first()) {
                let lastMessage = messages.first();
                if (lastMessage.content.length < 1600) {
                    lastMessage.edit(`${lastMessage.content}\n${stringToSend}`)
                } else {
                    archiveListChannel.send(stringToSend); // most recent message is too full
                }
            } else {
                archiveListChannel.send(stringToSend); // no message in channel to edit
            }
        });

    return embedUrl;
}