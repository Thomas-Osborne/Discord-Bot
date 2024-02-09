const { EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');

module.exports = {
    name: 'rankings',
    description: 'Show which emojis have got used the most.',
    devOnly: true,

    callback: async (client, interaction) => {
        const data = await Reaction.find({});
        
        let rankedReactions = [];

        for (const item of data) {
            console.log(item.name);
            console.log(item.reactionId);
            if (!(rankedReactions.map(reaction => reaction.name).includes((item.name)))) {
                rankedReactions.push({reactionId: item.reactionId, name: item.name, total: 0});
            }
        }

        for (const reaction of rankedReactions) {
            console.log(reaction.name);
            reaction.total = await Reaction.find({name: reaction.name}).count();
            console.log(reaction.total);
        }

        rankedReactions = rankedReactions
            .sort((a, b) => b.total - a.total)
            .filter(reaction => reaction.total >= 0);

        const embed = new EmbedBuilder()
        
        .setTitle('Leaderboard')
        .setDescription('Which reaction is most used?')
        .addFields(
              {name: '🥇 First Place 🥇', value: `${unwrapEmojiName(rankedReactions[0].reactionId, rankedReactions[0].name)}—\t${rankedReactions[0].total}`},
              {name: '🥈 Second Place 🥈', value:`${unwrapEmojiName(rankedReactions[1].reactionId, rankedReactions[1].name)}—\t${rankedReactions[1].total}`},
              {name: '🥉 Third Place 🥉', value: `${unwrapEmojiName(rankedReactions[2].reactionId, rankedReactions[2].name)}—\t${rankedReactions[2].total}`}
        )
        .setTimestamp(Date.now())

        await interaction.reply({ embeds: [embed]});
    }
}