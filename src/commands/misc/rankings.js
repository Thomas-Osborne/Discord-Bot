const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const Person = require('../../models/Person');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');

module.exports = {
    name: 'rankings',
    description: 'Show which emojis have got used the most.',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to find out a reaction.',
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'sent-or-received',
            description: 'Type SEND or RECEIVED to find leaderboard for sent or received emojis respectively.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'emoji',
            description: 'Emoji to find rankings of',
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, interaction) => {

        let emoji = interaction.options.get('emoji').value;
        emoji = emoji.replace('<:', '');
        emoji = emoji.replace('>', '');
        const [emojiName, emojiId] = emoji.split(":"); 

        let sentOrReceived = (interaction.options.get('sent-or-received'));


        if (!sentOrReceived) {
            sentOrReceived = 'reactionsReceived'; // assume received if not filled in
        } else {
            sentOrReceived = sentOrReceived.value.toLowerCase();
            if (sentOrReceived === 'sent' || sentOrReceived === 'send') {
                sentOrReceived = 'reactionsSent';
            } else if (sentOrReceived === 'received' || sentOrReceived === 'receive') {
                sentOrReceived = 'reactionsReceived';
            } else {
                interaction.reply({ content: 'Option must either be SENT or RECEIVED.', ephemeral: true })
                return;
            }
        }

        let data;
        const user = interaction.options.get('user');
        if (emoji && user) {
            interaction.reply({ content: 'You cannot fill both the emoji and user arguments!', ephemeral: true })
            return;
        }

        if (user) {
            const person = await Person.findOne( {userId: user.value } ).populate(sentOrReceived);
            if (sentOrReceived === 'reactionsSent') {
                data = person.reactionsSent;
            } else if (sentOrReceived === 'reactionsReceived') {
                data = person.reactionsReceived;
            }
        } else {
            data = await Reaction.find({});
        }



        let rankedReactions = [];

        for (const item of data) {
            if (!(rankedReactions.map(reaction => reaction.name).includes((item.name)))) {
                rankedReactions.push({reactionId: item.reactionId, name: item.name, total: 0});
            }
        }

        for (const reaction of rankedReactions) {
            reaction.total = await Reaction.find({name: reaction.name}).count();
        }

        rankedReactions = rankedReactions
            .sort((a, b) => b.total - a.total)
            .filter(reaction => reaction.total >= 0);

        const embed = new EmbedBuilder()
        
        .setTitle('Leaderboard')
        .setDescription(user 
            ? `Which reaction is most used by ${user.value}?`
            : `Which reaction is most used?`
        )
        .setTimestamp(Date.now())

        const numberOfRows = Math.min(rankedReactions.length, 10);

        for (let i = 0; i < numberOfRows; i++) {
            if (i === 0) {
                nameString = '🥇 1st Place 🥇'
            } else if (i === 1) {
                nameString = '🥈 2nd Place 🥈'
            } else if (i === 2) {
                nameString = '🥉 3rd Place 🥉'
            } else {
                nameString = `${i + 1}th Place`
            }
            embed.addFields(
                {name: nameString, value: `${unwrapEmojiName(rankedReactions[i].reactionId, rankedReactions[i].name)}—\t${rankedReactions[i].total}`},
            )
        }
        await interaction.reply({ embeds: [embed]});
    }
}