const { EmbedBuilder } = require('discord.js');
const User = require('../../models/User');

module.exports = {
    name: 'leaderboard',
    description: 'Show the rankings of the most moneys.',
    devOnly: true,

    callback: async (client, interaction) => {
        const data = await User.find({});

        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();

        const membersId = guild.members.cache.map(member => member.id);
        let rankedMembers = [];

        for (const item of data) {
            if (membersId.includes((item.userId))) {
                rankedMembers.push(item);
            }
        }

        rankedMembers = rankedMembers
            .sort((a, b) => b.money - a.money)
            .filter(member => member.money > 0);

        const embed = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription('Who has the most money?')
        .addFields(
              {name: '🥇 First Place 🥇', value: `${guild.members.cache.get(rankedMembers[0].userId).user.username}: ${rankedMembers[0].money}`},
              {name: '🥈 Second Place 🥈', value: `${guild.members.cache.get(rankedMembers[1].userId).user.username}: ${rankedMembers[1].money}`},
              {name: '🥉 Third Place 🥉', value: `${guild.members.cache.get(rankedMembers[2].userId).user.username}: ${rankedMembers[2].money}`}
        )
        .setTimestamp(Date.now())

        await interaction.reply({ embeds: [embed]});
    }
}