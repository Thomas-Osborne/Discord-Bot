const { EmbedBuilder } = require('discord.js');
const Reaction = require('../../models/Reaction');
const formatDate = require('../../utils/formatDate');
const getDateMonthYear = require('../../utils/getDateMonthYear');
const createLeaderboard = require('../../utils/createLeaderboard');

require('dotenv').config();

module.exports = {
    name: 'selfreacts',
    description: 'See who has self-reacted the most.',
    devOnly: true,

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();
        const membersId = guild.members.cache.map(member => member.id);

        let rankings = [];
        for (const id of membersId) {
            count = await Reaction.find( { authorId: id, reacterId: id }).count();
            console.log(id, count);
            rankings.push({id: id, value: count});
        }

        rankings = rankings
            .sort((a, b) => b.value - a.value)
            .filter(reaction => reaction.value > 0);


        const numberOfRows = Math.min(rankings.length, 10);

        const fieldValues = []

        for (let i = 0; i < numberOfRows; i++) {
            fieldValues.push(`${guild.members.cache.get(rankings[i].id).user.username} — ${rankings[i].value} times`);
        }

        const embed = await createLeaderboard(numberOfRows, 'Leaderboard', 'Who has self-reacted the most?', Date.now(), fieldValues)
        await interaction.reply({ embeds: [embed]});

    }


}