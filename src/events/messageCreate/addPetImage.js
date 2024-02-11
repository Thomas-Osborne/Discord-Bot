require('dotenv').config();
const Pet = require('../../models/Pet');
const Person = require('../../models/Person');

const { Client, Message } = require('discord.js');

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (message.guild.id !== process.env.GUILD_ID || message.channel.id !== process.env.CHANNEL_PETS_ID) {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if (message.attachments) {
        let urls = message.attachments
            .filter(attachment => attachment.contentType.startsWith('image')) // only get image attachments
            .map(attachment => attachment.url);

        let author = await Person.findOne({ userId: message.author.id });

        if (!author) {
            author = new Person({
                userId: message.author.id,
                guildId: message.guild.id,
            })
        }

        await author.save()
            .catch(error => console.error(`Error adding author as a person: ${error}`))


        for (let i = 0; i < urls.length; i++) {
            const pet = new Pet({
                messageId: message.id,
                guildId: message.guild.id,
                authorId: message.author.id,
                url: urls[i],
                timestamp: message.createdTimestamp,
            });
            await pet.save()
            .catch(error => console.error(`Error creating new pet entry: ${error}`));

            console.log(author);
            author.petPictures.push(pet._id)
            await author.save()
                .catch(error => console.error(`Error adding pet to author: ${error}`));
        }
    }


    try {
        if (message.content === 'hello') {
            message.reply('Hi there!');
        }
    } catch (error) {
        console.error(`Error saying hi: ${error}`);
    }
}