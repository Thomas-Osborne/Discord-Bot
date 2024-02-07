require('dotenv').config();

const { Client, Events, IntentsBitField, Partials, EmbedBuilder } = require('discord.js');

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

client.on('interactionCreate', (interaction) => {
    if (!(interaction.isChatInputCommand() || interaction.isMessageContextMenuCommand)) {
        return;
    }

    if (interaction.commandName === 'hey') {
        interaction.reply('Hi there!');
    }

    if (interaction.commandName === 'ping') {
        interaction.reply('Pong!');
    }

    if (interaction.commandName === 'Add to Archives') {
        if (interaction.targetMessage.member.user.bot) {
            interaction.reply({ content: 'You cannot add a bot message to the archives.', ephemeral: true }); // cannot archive a bot message
        } else if (interaction.targetMessage.member.id === interaction.member.id) {
            interaction.reply({ content: 'You cannot add your own message to the archives!', ephemeral: true }); // user cannot archive their own message
        } else {
            addToArchives(interaction.targetMessage, interaction.member.displayName);
            interaction.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.member.id}>'s message!`);
        }        
    }

})

client.on(Events.MessageReactionAdd, async (reaction, user) => {
    const MAX_REACTS = 1;
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
        addToArchives(reaction.message, `Maximum reacts of ${emojiStr}`);
    }
})

async function fetchChannelMessages(channel, limit) {
    const messages = await channel.messages.fetch({ limit: 100 });
    return messages;
}

function addToArchives(message, archiver) {
    const channel = client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID);

    const url = `http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`;

    let truthVal = true;
    console.log(message);
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