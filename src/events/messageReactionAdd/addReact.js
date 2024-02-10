require('discord.js');
const Reaction = require('../../models/Reaction');
const Person = require('../../models/Person');


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
            reacterId: user.id,
            reacterIsBot: user.bot,
        })
        await react.save()
            .catch(error => console.error(`Error creating new reaction entry: ${error}`));

        let author = await Person.findOne({ userId: react.authorId, });

        if (!author) {
            author = new Person({
                userId: react.authorId,
                guildId: react.guildId,
            })
        }


        author.reactionsReceived.push(react._id);
        await author.save()
            .catch(error => console.error(`Error adding new reaction to author: ${error}`))


        let reacter = await Person.findOne({ userId: react.reacterId, });

        if (!reacter) {
            reacter = new Person({
                userId: react.reacterId,
                guildId: react.guildId,
            })
        }

        reacter.reactionsSent.push(react._id);
        await reacter.save()
            .catch(error => console.error(`Error adding new reaction to reacter: ${error}`))


        console.log(author);
        console.log(reacter);
        return;

    } catch (error) {
        console.error(`Error increasing reaction count: ${error}`)
    }
}