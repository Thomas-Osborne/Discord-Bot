const createLeaderboard = require('../../utils/createLeaderboard');
const Pet = require('../../models/Pet');
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

        let rankings = [];
        for (const id of membersId) {
            count = await Pet.find( { authorId: id }).count();
            console.log(count);
            rankings.push({id: id, value: count});
        }

        console.log(rankings);
        rankings = rankings
            .sort((a, b) => b.value - a.value)
            .filter(pet => pet.value > 0);

        const numberOfRows = Math.min(rankings.length, 10);
        const fieldValues = []
    
        for (let i = 0; i < numberOfRows; i++) {
            fieldValues.push(`${guild.members.cache.get(rankings[i].id).user.username} — ${rankings[i].value} times`);
        }

        const embed = await createLeaderboard(numberOfRows, 'Leaderboard', `Who has sent the most images to <#${process.env.CHANNEL_PETS_ID}>?`, Date.now(), fieldValues);
        await interaction.reply({ embeds: [embed]});

    }


}