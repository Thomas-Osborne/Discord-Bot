const { EmbedBuilder } = require('discord.js');

module.exports = async (data, rows, title, description, timestamp, fieldValues) => {
    data = data
    .sort((a, b) => b.value - a.value)
    .filter(member => member.value > 0);


const embed = new EmbedBuilder()
.setTitle(title)
.setDescription(description)
.setTimestamp(timestamp)


for (let i = 0; i < rows; i++) {
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
        {name: nameString, value: `${fieldValues[i]}`},
    )
}

return embed;

}
