const { EmbedBuilder } = require('discord.js');
const Person = require('../../models/Person');

module.exports = {
    name: 'leaderboard',
    description: 'Show the rankings of the most moneys.',
    devOnly: true,

    callback: async (client, interaction) => {
        const data = await Person.find({});

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
        .setTimestamp(Date.now())

        const numberOfRows = Math.min(rankedMembers.length, 10);

        for (let i = 0; i < numberOfRows; i++) {
            embed.addFields(
                {name: `Number ${i + 1}`, value: `${guild.members.cache.get(rankedMembers[i].userId).user.username}: £${rankedMembers[i].money}`},
                )
        }

        await interaction.reply({ embeds: [embed]});
    }
}