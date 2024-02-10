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

        const react = await Reaction.deleteOne({
            guildId: reaction.message.guild.id,
            messageId: reaction.message.id,
            reacterId: user.id,
            reactionId: reaction.emoji.id,
        })
            .catch(error => console.error(`Error deleting reaction entry: ${error}`))
        console.log(react);

        return;

    } catch (error) {
        console.error(`Error increasing reaction count: ${error}`)
    }
}