const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const Person = require('../../models/Person');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');
const sortData = require('../../utils/sortData');
const createLeaderboard = require('../../utils/createLeaderboard');
const formatDate = require('../../utils/formatDate');
const getDateMonthYear = require('../../utils/getDateMonthYear');

module.exports = {
    name: 'rankings',
    description: 'Show which emojis have got used the most.',
    options: [
        {
            name: 'user',
            description: 'The user to find out a reaction.',
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'sent-or-received',
            description: 'Type SENT or RECEIVED to find leaderboard for sent or received emojis respectively.',
            type: ApplicationCommandOptionType.String,
        },
        {
            name: 'emoji',
            description: 'Emoji to find rankings of',
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        let emoji = interaction.options.get('emoji')

        let emojiName;
        let emojiId;

        if (emoji) {
            emoji = emoji.value;
            emoji = emoji.replace('<:', '');
            emoji = emoji.replace('>', '');
            [emojiName, emojiId] = emoji.split(":"); 
        }
        
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

        let rankings = [];
        if (user) {
            const person = await Person.findOne( {userId: user.value } ).populate(sentOrReceived);
            if (sentOrReceived === 'reactionsSent') {
                data = person.reactionsSent;
            } else if (sentOrReceived === 'reactionsReceived') {
                data = person.reactionsReceived;
            }
            for (const item of data) {
                if (!(rankings.map(reaction => reaction.name).includes((item.name)))) {
                    rankings.push({reactionId: item.reactionId, name: item.name, value: 0});
                }
            }
            for (const reaction of rankings) {
                reaction.value = await Reaction.find({name: reaction.name}).count();
            }

        } else if (emoji) {
            await guild.members.fetch();
            const membersId = guild.members.cache.map(member => member.id);

            let typeOfId;
            if (sentOrReceived === 'reactionsSent') {
                typeOfId = 'reacterId';
            } else {
                typeOfId = 'authorId';
            }
            for (const id of membersId) {
                count = await Reaction.find( {name: emojiName, [typeOfId]: id }).count();
                rankings.push({userId: id, value: count});
            }

        } else {
            data = await Reaction.find({});
            for (const item of data) {
                if (!(rankings.map(reaction => reaction.name).includes((item.name)))) {
                    rankings.push({reactionId: item.reactionId, name: item.name, value: 0});
                }
            }
    
            for (const reaction of rankings) {
                reaction.value = await Reaction.find({name: reaction.name}).count();
            }
        }

        rankings = rankings
            .sort((a, b) => b.value - a.value)
            .filter(reaction => reaction.value > 0);

        const embed = new EmbedBuilder()

        .setTitle('Leaderboard')
        .setDescription(generateDescription(sentOrReceived, user, emojiName, emojiId))
        .setTimestamp(Date.now())

        const numberOfRows = Math.min(rankings.length, 10);
        
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
                {name: nameString, value: generateFieldValue(emoji ? true : false, rankings[i])},
            )
        }
        await interaction.reply({ embeds: [embed]});

        function generateDescription(sentOrReceived, user, emojiName, emojiId) {
            let sentOrReceivedSubstring;
            if (sentOrReceived === "reactionsSent") {
                sentOrReceivedSubstring = 'send'
            } else {
                sentOrReceivedSubstring = 'receive'
            }

            if (user) {
                return `Which reaction does ${guild.members.cache.get(user.value).user.displayName} ${sentOrReceivedSubstring} the most?`;
            } else if (emojiName) {
                return `Who reacts the most with ${unwrapEmojiName(emojiId, emojiName)}?`;
            } else {
                return `Which reaction is used the most?`;
            }
        }

        function generateFieldValue(thereIsEmoji, entry) {
            if (thereIsEmoji) {
                return `${guild.members.cache.get(entry.userId).user.displayName} — ${entry.value} times`;
            } else {
                return `${unwrapEmojiName(entry.reactionId, entry.name)}—\t${entry.value} times`;

            }
        }
    }


}