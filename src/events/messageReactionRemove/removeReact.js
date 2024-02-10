const { Client, MessageReaction, User } = require('discord.js');
const Reaction = require('../../models/Reaction');
const Person = require('../../models/Person');

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

        const react = await Reaction.findOneAndDelete({
            guildId: reaction.message.guild.id,
            messageId: reaction.message.id,
            reacterId: user.id,
            reactionId: reaction.emoji.id,
        })
            .catch(error => console.error(`Error deleting reaction entry: ${error}`))

        const author = await Person.findOne({ reactionsReceived: react._id })
        author.reactionsReceived.pull(react._id);
        author.save()
            .catch(error => console.error(`Error updating author: ${error}`));

        const reacter = await Person.findOne({ reactionsSent: react._id })
        reacter.reactionsSent.pull(react._id);
        reacter.save()
            .catch(error => console.error(`Error updating reacter: ${error}`));
        
        return;
    } catch (error) {
        console.error(`Error decreasing reaction count: ${error}`)
    }
}