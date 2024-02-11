const { EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const formatDate = require('../../utils/formatDate');
const getDateMonthYear = require('../../utils/getDateMonthYear');
require('dotenv').config();

module.exports = {
    name: 'selfreacts',
    description: 'See who has self-reacted the most.',
    devOnly: true,

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();
        const membersId = guild.members.cache.map(member => member.id);

        let ranks = [];
        for (const id of membersId) {
            count = await Reaction.find( { authorId: id, reacterId: id }).count();
            ranks.push({userId: id, total: count});
        }

        ranks = ranks
            .sort((a, b) => b.total - a.total)
            .filter(reaction => reaction.total > 0);

        const embed = new EmbedBuilder()

        .setTitle('Leaderboard')
        .setDescription(`Who has self-reacted the most?`)
        .setTimestamp(Date.now())

        const numberOfRows = Math.min(ranks.length, 10);
        
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
                {name: nameString, value: generateFieldValue(ranks[i])},
            )
        }
        await interaction.reply({ embeds: [embed]});

        function generateFieldValue(entry) {
            return `${guild.members.cache.get(entry.userId).user.username} — ${entry.total} times`;
        }
    }


}