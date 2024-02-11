const Person = require('../../models/Person');
const createLeaderboard = require('../../utils/createLeaderboard');

module.exports = {
    name: 'leaderboard',
    description: 'Show the rankings of the most moneys.',
    devOnly: true,

    callback: async (client, interaction) => {
        const data = await Person.find({});

        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();

        const membersId = guild.members.cache.map(member => member.id);
        let rankings = [];

        for (const item of data) {
            if (membersId.includes((item.userId))) {
                rankings.push({ id: item.userId, value: item.money });
            }
        }

        rankings = rankings
        .sort((a, b) => b.value - a.value)
        .filter(member => member.value > 0);

        const numberOfRows = Math.min(rankings.length, 10);
        const fieldValues = []

        for (let i = 0; i < numberOfRows; i++) {
            fieldValues.push(`${guild.members.cache.get(rankings[i].id).user.username} — £${rankings[i].value}`);
        }
        const embed = await createLeaderboard(rankings, numberOfRows, 'Leaderboard', 'Who has the most money?', Date.now(), fieldValues);

        await interaction.reply({ embeds: [embed]});
    }

}