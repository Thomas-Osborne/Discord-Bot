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
        console.log(interaction.member.displayHexColor);
        const embed = new EmbedBuilder()
            .setTitle('Archive Entry: #xx')
            .setDescription(interaction.targetMessage.content)
            .setFields(
                {name: 'Sent by', value: `${interaction.targetMessage.member.displayName}`},
                {name: 'Archived by', value: `${interaction.member.displayName}`}
            )
            .setTimestamp(interaction.targetMessage.createdTimestamp)
            .setColor(interaction.targetMessage.member.displayHexColor)
            .setThumbnail(interaction.targetMessage.member.avatarURL())
        client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});

        interaction.reply(`<@${interaction.member.id}> has archived <@${interaction.targetMessage.member.id}>'s message!`);
        
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