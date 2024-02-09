const { Client, MessageReaction, User } = require('discord.js');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');

/**
 *
 * @param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (client, reaction, user) => {
    try {
        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error(`Error: ${error}`);
                return;
            }
        }

        const emojiStr = unwrapEmojiName(reaction.emoji.id, reaction.emoji.name);

        reaction.message.reply(emojiStr);

    } catch (error) {
        console.error(`Error increasing reaction count: ${error}`)
    }
}