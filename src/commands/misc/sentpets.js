const { EmbedBuilder } = require('discord.js');
const Pet = require('../../models/Pet');
const Person = require('../../models/Person');
const formatDate = require('../../utils/formatDate');
const getDateMonthYear = require('../../utils/getDateMonthYear');
require('dotenv').config();

module.exports = {
    name: 'sentpets',
    description: 'See who has sent the most pets.',
    devOnly: true,

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();
        const membersId = guild.members.cache.map(member => member.id);

        let ranks = [];
        for (const id of membersId) {
            count = await Pet.find( { authorId: id }).count();
            ranks.push({userId: id, total: count});
        }

        ranks = ranks
            .sort((a, b) => b.total - a.total)
            .filter(reaction => reaction.total > 0);

        const embed = new EmbedBuilder()

        .setTitle('Leaderboard')
        .setDescription(`Who has sent the most images to <#${process.env.CHANNEL_PETS_ID}>?`)
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