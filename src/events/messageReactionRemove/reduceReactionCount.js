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

        // do not include reacts to bots in the count
        if (reaction.message.author.bot) {
            return;
        }

        const query = {
            reactionId: reaction.emoji.id,
            name: reaction.emoji.name,
            guildId: reaction.message.guildId,
        }

        const react = await Reaction.findOne(query);
            
            if (react) {
                react.count -= 1;
                await react.save()
                    .catch(error => console.error(`Error saving new moneys: ${error}`));
            } else {
                const newReact = new Reaction({
                    reactionId: reaction.emoji.id,
                    name: reaction.emoji.name,
                    guildId: reaction.message.guildId,
                })
                await newReact.save()
                    .catch(error => console.error(`Error creating new reaction entry ${error}`));
            }

        return;

    } catch (error) {
        console.error(`Error increasing reaction count: ${error}`)
    }
}