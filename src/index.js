require('dotenv').config();

const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
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
        console.log(interaction);
        console.log(interaction.targetMessage);
        const embed = new EmbedBuilder()
            .setTitle('Archive Entry: #xx')
            .setDescription(interaction.targetMessage.content)
            .setFields(
                {name: 'Sent by', value: `${interaction.targetMessage.author.username}`},
                {name: 'Archived by', value: `${interaction.user.username}`}
            )
            .setTimestamp(interaction.targetMessage.createdTimestamp)
            .setColor(interaction.member.displayHexColor)
            .setThumbnail(interaction.targetMessage.author.avatarURL())
        client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});
        interaction.reply('Archived!');
        
    }

})

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }

    if (message.content == 'hello') {
        message.reply('Hi there!');
    } else {
        console.log('Message received.');
    }
})