const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');

module.exports = {
    name: 'rankings',
    description: 'Show which emojis have got used the most.',
    devOnly: true,
    options: [
        {
            name: 'user',
            description: 'The user to find out their most received used reaction.',
            type: ApplicationCommandOptionType.Mentionable,
        },
    ],

    callback: async (client, interaction) => {
        
        let data;
        if (interaction.options.get('user')) {
            const userId = interaction.options.get('user').value;
            data = await Reaction.find({authorId: userId});
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
        .setDescription('Which reaction is most used?')
        .setTimestamp(Date.now())

        const numberOfRows = Math.min(rankedReactions.length, 10);

        for (let i = 0; i < numberOfRows; i++) {
            embed.addFields(
                {name: `Number ${i + 1}`, value: `${unwrapEmojiName(rankedReactions[i].reactionId, rankedReactions[i].name)}—\t${rankedReactions[i].total}`},
            )
        }
        await interaction.reply({ embeds: [embed]});
    }
}