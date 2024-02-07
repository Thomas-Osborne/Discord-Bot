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
    if (!interaction.isChatInputCommand()) {
        return;
    }

    if (interaction.commandName === "hey") {
        interaction.reply("Hi there!");
    }

    if (interaction.commandName === "ping") {
        interaction.reply("Pong!");
    }

    if (interaction.commandName === "archive") {
        console.log(interaction);
        console.log(interaction.user.globalName);
        console.log(interaction.channel.name);
        console.log(interaction.member.displayHexColor);
        console.log(interaction.user.defaultAvatarURL);

        const embed = new EmbedBuilder()
            .setTitle('Archive Entry Number xx')
            .setDescription('Message Contents')
            .setFields(
                {name: 'Sent by', value: 'Bananas'},
                {name: 'Archived by', value: `${interaction.user.globalName}`}
            )
            .setTimestamp(Date.now())
            .setColor(interaction.member.displayHexColor)
            .setThumbnail(interaction.user.defaultAvatarURL)
        interaction.reply('Got it!');
        client.channels.cache.get(process.env.CHANNEL_ARCHIVES_ID).send({ embeds: [embed]});
        
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