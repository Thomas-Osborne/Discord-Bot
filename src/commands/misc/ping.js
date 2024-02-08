module.exports = {
    name: 'ping',
    description: 'Says pong!',
    devOnly: true,

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    }
}