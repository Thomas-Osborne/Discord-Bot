require('dotenv').config();
const { Client, Message } = require('discord.js');
const Pet = require('../../models/Pet');
const Person = require('../../models/Person');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    try {
        if (message.guild.id !== process.env.GUILD_ID || message.channel.id !== process.env.CHANNEL_PETS_ID) {
            return;
        }

        if (!message.attachments) {
            return;
        }

        const deletedPets = await Pet.find({ messageId: message.id, channelId: message.channelId, guildId: message.guildId});
        await Pet.deleteMany({ messageId: message.id, channelId: message.channelId, guildId: message.guildId});

        for (const pet of deletedPets) {
            const author = await Person.findOne({ userId: pet.authorId });
            author.petPictures.pull(pet._id);
            author.save()
                .catch(error => console.error(`Error updating author when deleting pets: ${error}`));
        }

        return;        

    } catch (error) {
        console.error(`Error deleting pet entry: ${error}`)
    }
}