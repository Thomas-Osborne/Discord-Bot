require('dotenv').config();
const numberToWords = require('number-to-words'); // changes number into word form

const { Client, Events, IntentsBitField, Partials, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
    ],
    partials: [
        Partials.User,
        Partials.Message,
        Partials.Reaction,
    ]
});

client.login(process.env.TOKEN);

let archiveNameValue;

client.on('ready', (c) => {
    console.log(`${c.user.username} is online!`);
})

client.on(Events.InteractionCreate, async (interaction) => {
    if (!(interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand)) {
        return;
    }

    if (interaction.commandName === 'Add to Archives') {
        if (interaction.targetMessage.author.bot) {
            interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
        } else if (interaction.targetMessage.author.id === interaction.member.id) {
            interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
        } else {
            const modal = buildModal();
            await interaction.showModal(modal);

            const filter = (interaction) => interaction.customId === "archiveModal";
            interaction
                .awaitModalSubmit( {filter, time: 30000} )
                .then(async (modalInteraction) => {
                    archiveNameValue = modalInteraction.fields.getTextInputValue('archiveNameInput');
                    if (await canArchive(interaction.targetMessage)) {
                        addToArchives(interaction.targetMessage, interaction.member.displayName, archiveNameValue);
                        interaction.targetMessage.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.author.id}>'s message!`);
                    } else {
                        interaction.targetMessage.reply( { content: `<@${interaction.member.id}>, this message has already been added to the archives.`, ephemeral: true })
                    }
                    modalInteraction.deferUpdate();
                })
        }        
    }
})

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    const MAX_REACTS = 1;
    const wordMax = numberToWords.toWords(MAX_REACTS);

    let wordPlusEr;
    // make comparative version of the word
    if (wordMax.slice(-1) === 'e') {
        wordPlusEr = wordMax + 'r'; // only add r if the last letter of the number as a word is an e
    } else {
        wordPlusEr = wordMax + "er";
    }

    if (reaction.partial) {
        try {
			await reaction.fetch();
		} catch (error) {
			console.error(`Error: ${error}`);
			return;
		}
    }

    if (reaction.count == MAX_REACTS && !(reaction.message.author.bot)) {
        let emojiStr;
        if (reaction.emoji.id) {
            emojiStr = `<:${reaction.emoji.name}:${reaction.emoji.id}>`;
        } else {
            emojiStr = reaction.emoji.name;
        }
        if (await canArchive(reaction.message)) {
            addToArchives(reaction.message, `That's a ${wordPlusEr}! ${emojiStr}`, `A ${wordPlusEr} from ${reaction.message.author.displayName}`);
            reaction.message.reply(`That's a ${wordPlusEr}! ${emojiStr}`);
        }
    }
})

function buildModal() {
    const modal = new ModalBuilder()
        .setCustomId('archiveModal')
        .setTitle('Add to Archives');
    const archiveNameInput = new TextInputBuilder()
        .setCustomId('archiveNameInput')
        .setLabel('Name the Archive Entry')
        .setStyle(TextInputStyle.Short);
    const firstActionRow = new ActionRowBuilder().addComponents(archiveNameInput);
    modal.addComponents(firstActionRow);
    return modal;
}

async function fetchChannelMessages(channel, limit) {
    const messages = await channel.messages.fetch({ limit: 100 });
    return messages;
}

async function canArchive(message) {
    let truthVal = true;
    const archiveChannel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID);
    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

    await fetchChannelMessages(archiveChannel, 100)
        .then(messages => {
            for (const message of messages) {
                if (message[1].embeds[0].url === url) { // SHOULD IMPROVE -- NOT ROBUST AT ALL!
                    truthVal = false;
                    break;
                }
            }
        })
    return truthVal;
}

async function addToArchives(message, archiver, title) {
    const MAX_DESC_LENGTH = 300; // max number of characters to show in a description

    const member = await message.guild.members.fetch(message.author.id); // need to be able to obtain guild member properties like name colour
    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`

    const embed = new EmbedBuilder()
        .setColor(member.displayHexColor)
        .setTitle(title)
        .setURL(url)
        .setDescription(message.content.length < MAX_DESC_LENGTH ? message.content : `${message.content.slice(0, MAX_DESC_LENGTH - 5)}...`)
        .addFields(
            {name: 'Sent by', value: `${member.displayName}`, inline: true},
            {name: 'Archived by', value: `${archiver}`, inline: true},
            {name: 'Channel', value: `${client.channels.cache.get(message.channelId).name}`}
        )
        .setTimestamp(message.createdTimestamp)
        .setThumbnail(member.avatarURL() 
            ? member.avatarURL() 
            : member.defaultAvatarURL // show default avatar if no avatar exists
        )
        
    client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});
    const date = new Date(message.createdTimestamp);
    const stringToSend = `[• ${date.toLocaleString().substring(0, date.toLocaleString().indexOf(','))} — ${member.displayName} — ${title}](${url})`;
    client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID).messages
        .fetch({ limit: 1 })
        .then(messages => {
            if (messages.first()) {
                let lastMessage = messages.first();
                if (lastMessage.content.length < 1600) {
                    lastMessage.edit(`${lastMessage.content}\n${stringToSend}`)
                } else {
                    client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID).send(stringToSend); // most recent message is too full
                }
            } else {
                client.channels.cache.get(process.env.CHANNEL_ARCHIVES_LIST_ID).send(stringToSend); // no message in channel to edit
            }
        });
    return;
}