const { ApplicationCommandOptionType } = require('discord.js');
const Person = require('../../models/Person');

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

        const query = {
            userId: target.id,
            guildId: target.guild.id,
        }

        if (amount <= 0 || !Number.isInteger(amount)) {
            interaction.reply({ content: "The amount must be a positive integer.", ephemeral: true })
            return;
        }

        try {
            const user = await Person.findOne(query);
            
            if (user) {
                user.money += amount;
                await user.save()
                    .catch(error => console.error(`Error saving new moneys: ${error}`));
            } else {
                const newUser = new Person({
                    userId: target.id,
                    guildId: target.guild.id,
                    money: amount,
                })
                await newUser.save()
                    .catch(error => console.error(`Error creating new user entry ${error}`));
            }
            interaction.reply(`Sent <@${target.id}> £${amount}! They now have £${user.money}.`);
        } catch (error) {
            console.error(`Error giving money: ${error}`)
        }

    }
}