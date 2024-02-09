const { ApplicationCommandOptionType } = require('discord.js');
const Wealth = require('../../models/Wealth');

module.exports = {
    name: 'gift',
    description: 'Give money to a member from the server.',
    devOnly: true,
    options: [
        {
            name: 'target-user',
            description: 'The user to give money to.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'amount',
            description: 'The amount of money to give to the user.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    callback: async (client, interaction) => {

        const amount = interaction.options.get('amount').value;
        const target = interaction.options.get('target-user').member; // useful to have the object as a guild member

        console.log(target);

        const query = {
            userId: target.id,
            guildId: target.guild.id,
        }

        try {
            const wealth = await Wealth.findOne(query);
            console.log(wealth);
            
            if (wealth) {
                wealth.money += amount;
                await wealth.save()
                    .then(console.log("Saved!"))
                    .catch(error => console.error(`Error saving new moneys: ${error}`));
            } else {
                const newWealth = new Wealth({
                    userId: target.id,
                    guildId: target.guild.id,
                    money: amount,
                })
                await newWealth.save()
                    .then(console.log("Saved!"))
                    .catch(error => console.error(`Error creating new wealth entry ${error}`));
            }
            interaction.reply(`Sent <@${target.id}> £${amount}! They now have £${wealth.money}.`);
        } catch (error) {
            console.error(`Error giving money: ${error}`)
        }

    }
}