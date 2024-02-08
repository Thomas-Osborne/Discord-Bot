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

client.on('ready', (c) => {
    console.log(`${c.user.username} is online!`);
})

client.on(Events.InteractionCreate, (interaction) => {
    if (!(interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand)) {
        return;
    }

    if (interaction.commandName === 'Add to Archives') {
        if (interaction.targetMessage.author.bot) {
            interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
        } else if (interaction.targetMessage.author.id === interaction.member.id) {
            interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
        } else {
            // buildModal();
            addToArchives(interaction.targetMessage, interaction.member.displayName);
            interaction.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.author.id}>'s message!`);
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
        addToArchives(reaction.message, `That's a ${wordPlusEr}! ${emojiStr}`);
        reaction.message.reply(`That's a ${wordPlusEr}! ${emojiStr}`);
    }
})

async function buildModal() {
    const modal = new ModalBuilder()
        .setCustomId('archiveModal')
        .setTitle('Add to Archives');
    const archiveNameInput = new TextInputBuilder()
        .setCustomId('archiveName')
        .setLabel('Name the Archive Entry')
        .setStyle(TextInputStyle.Short);
    const firstActionRow = new ActionRowBuilder().addComponents(archiveNameInput);
    modal.addComponents(firstActionRow);

    const shownModal = await interaction.showModal(modal);
    return shownModal;
}

async function fetchChannelMessages(channel, limit) {
    const messages = await channel.messages.fetch({ limit: 100 });
    return messages;
}

function addToArchives(message, archiver) {
    const channel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID);

    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

    let truthVal = true;
    fetchChannelMessages(channel, 100)
        .then(messages => {
            for (const message of messages) {
                if (message[1].embeds[0].url === url) { // SHOULD IMPROVE -- NOT ROBUST AT ALL!
                    truthVal = false;
                    break;
                }
            }
            if (truthVal) {
                const embed = new EmbedBuilder()
                    .setColor(message.member.displayHexColor)
                    .setTitle('Archive Entry: #xx')
                    .setURL(`http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`)
                    .setDescription(message.content)
                    .addFields(
                        {name: 'Sent by', value: `${message.member.displayName}`, inline: true},
                        {name: 'Archived by', value: `${archiver}`, inline: true},
                        {name: 'Channel', value: `${client.channels.cache.get(message.channelId).name}`}
                    )
                    .setTimestamp(message.createdTimestamp)
                    .setThumbnail(message.member.user.avatarURL()) // avatarURL is a user attribute
                    
                client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});
            }
        }
    ) 

    return;
}