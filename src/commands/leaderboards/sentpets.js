const createLeaderboard = require('../../utils/createLeaderboard');
const sortData = require('../../utils/sortData');

const Pet = require('../../models/Pet');
const formatDate = require('../../utils/formatDate');
const getDateMonthYear = require('../../utils/getDateMonthYear');

const { guildId, channelPetsId } = require('../../../config.json');

module.exports = {
    name: 'sentpets',
    description: 'See who has sent the most pets.',

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();
        const membersId = guild.members.cache.map(member => member.id);

        let rankings = [];
        for (const id of membersId) {
            count = await Pet.find( { guildId: guildId, channelId: channelPetsId, authorId: id}).count();
            rankings.push({id: id, value: count});
        }

        rankings = sortData(rankings);

        const numberOfRows = Math.min(rankings.length, 10);
        const fieldValues = []
    
        for (let i = 0; i < numberOfRows; i++) {
            fieldValues.push(`${guild.members.cache.get(rankings[i].id).user.displayName} — ${rankings[i].value} times`);
        }

        const embed = await createLeaderboard(numberOfRows, 'Pet Sharers', `Who has sent the most images to <#${channelPetsId}>?`, Date.now(), fieldValues);
        await interaction.reply({ embeds: [embed]});

    }


}