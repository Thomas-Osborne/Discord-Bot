module.exports = {
    name: 'ping',
    description: 'Says pong!',

    callback: (client, interaction) => {
        interaction.reply(`Pong! ${client.ws.ping}ms`)
    }
}