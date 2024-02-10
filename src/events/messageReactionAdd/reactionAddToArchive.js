const { Client, MessageReaction, User } = require('discord.js');
const numberToWords = require('number-to-words'); // changes number into word form
const canArchive = require('../../utils/canArchive');
const addToArchives = require('../../utils/addToArchives');
const unwrapEmojiName = require('../../utils/unwrapEmojiName');
const Person = require('../../models/Person');
const Message = require('../../models/Message');

/**
 *
 * @param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (client, reaction, user) => {
    try {
        const MAX_REACTS = 1;
        const wordMax = numberToWords.toWords(MAX_REACTS);

        if (reaction.partial) {
            try {
                await reaction.fetch();
            } catch (error) {
                console.error(`Error: ${error}`);
                return;
            }
        }

        if (!(await canArchive(client, reaction.message))) {
            return;
        }

        // do not add a bot message to archives
        if (reaction.message.author.bot) {
            return;
        }

        // do not add to archives if not at required react threshold
        if (reaction.count < MAX_REACTS) {
            return;
        }

        // do not add to archives if react threshold is obtained exactly but someone has self-reacted
        if (reaction.count === MAX_REACTS) {
            const allReactUserIds = (await reaction.users.fetch()).keys();
            const originalAuthorId = reaction.message.author.id;
            for (const id of allReactUserIds) {
                if (id === originalAuthorId) {
                    return;
                }
            };
        }

        // if pass all conditions then can archive message

        const emojiStr = unwrapEmojiName(reaction.emoji.id, reaction.emoji.name);

        let wordPlusEr;
        // make comparative version of the word
        if (wordMax.slice(-1) === 'e') {
            wordPlusEr = wordMax + 'r'; // only add r if the last letter of the number as a word is an e
        } else {
            wordPlusEr = wordMax + "er";
        }

        const archiveTitle = `A ${wordPlusEr} from ${reaction.message.author.displayName}`;

        const message = new Message({
            messageId: reaction.message.id,
            guildId: reaction.message.guildId,
            channelId: reaction.message.channelId,
            authorId: reaction.message.author.id,
            timeStamp: reaction.message.createdTimestamp,
            archiveTitle: archiveTitle,
        })

        await message.save()
            .catch(error => console.error(`Error creating new message: ${error}`));

        let author = await Person.findOne({ userId: message.authorId, });

        if (!author) {
            author = new Person({
                userId: message.authorId,
                guildId: message.guildId,
            })
        }

        author.messagesArchived.push(message._id);
        await author.save()
            .catch(error => console.error(`Error adding new reaction to author: ${error}`))



        const url = await addToArchives(client, reaction.message, `That's a ${wordPlusEr}! ${emojiStr}`, archiveTitle);
        reaction.message.reply(`That's a ${wordPlusEr}! ${emojiStr}\n\n_See the [archive entry](<${url}>)._`);
    } catch (error) {
        console.error(`Error reading message being added: ${error}`);
    }
}