const Pet = require('../../models/Pet');

module.exports = {
    name: 'dailycute',
    description: 'Get a random pet photo.',

    callback: async (client, interaction) => {
        const guild = client.guilds.cache.get(interaction.guild.id);
        await guild.members.fetch();

        const data = await Pet.find({ });
        const numberOfEntries = data.length;

        const randomInt = Math.floor(Math.random() * numberOfEntries);

        const chosenPet = data[randomInt];


        const author = guild.members.cache.get(chosenPet.authorId).user.username;

        const messageUrl = `http://discord.com/channels/${chosenPet.guildId}/${chosenPet.channelId}/${chosenPet.messageId}`

        interaction.reply(`Sent by ${author}\n${chosenPet.url}\n\n[_Original Message_](${messageUrl})`);
    
    }
}