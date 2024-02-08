const { Client, MessageReaction, User } = require('discord.js');
const numberToWords = require('number-to-words'); // changes number into word form
const canArchive = require('../../utils/canArchive');
const addToArchives = require('../../utils/addToArchives');

/**
 *
 * @param {Client} client
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (client, reaction, message) => {
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

        let emojiStr;
        if (reaction.emoji.id) {
            emojiStr = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
        } else {
            emojiStr = reaction.emoji.name;
        }

        let wordPlusEr;
        // make comparative version of the word
        if (wordMax.slice(-1) === 'e') {
            wordPlusEr = wordMax + 'r'; // only add r if the last letter of the number as a word is an e
        } else {
            wordPlusEr = wordMax + "er";
        }

        const url = await addToArchives(client, reaction.message, `That's a ${wordPlusEr}! ${emojiStr}`, `A ${wordPlusEr} from ${reaction.message.author.displayName}`);
        reaction.message.reply(`That's a ${wordPlusEr}! ${emojiStr}\n\n_See the [archive entry](<${url}>)._`);
    } catch (error) {
        console.error(`Error reading react being added: ${error}`);
    }
}