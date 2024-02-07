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

    console.log(reaction.emoji);
    if (reaction.count == MAX_REACTS && !(reaction.message.author.bot)) {
        addToArchives(reaction.message, `Maximum reacts of ${reaction.emoji.name}`);
    }
})

function addToArchives(message, archiver) {
    const embed = new EmbedBuilder()
        .setColor(message.member.displayHexColor)
        .setTitle('Archive Entry: #xx')
        .setURL(`http://discord.com/channels/${message.guildId}/${message.channelId}/${message.id}`)
        .setDescription(message.content)
        .addFields(
            {name: 'Sent by', value: `${message.member.displayName}`, inline: true},
            {name: 'Archived by', value: `${archiver}`, inline: true},
        )
        .setTimestamp(message.createdTimestamp)
        .setThumbnail(message.member.user.avatarURL()) // avatarURL is a user attribute
        
    client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});
    return;
}