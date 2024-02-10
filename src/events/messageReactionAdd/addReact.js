const { Client, MessageReaction, User } = require('discord.js');
const Reaction = require('../../models/Reaction');

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

        const react = new Reaction({
            reactionId: reaction.emoji.id,
            name: reaction.emoji.name,
            guildId: reaction.message.guildId,
            messageId: reaction.message.id,
            channelId: reaction.message.channelId,
            authorId: reaction.message.author.id,
            authorIsBot: reaction.message.author.bot,
            // reacterId: reaction.message.interaction.user.id,
            // selfReact: (reaction.message.author.id === reaction.message.interaction.user.id),
        })
        await react.save()
            .catch(error => console.error(`Error creating new reaction entry ${error}`));

        return;

    } catch (error) {
        console.error(`Error increasing reaction count: ${error}`)
    }
}