const { ApplicationCommandOptionType } = require('discord.js');
const Wealth = require('../../models/Wealth');

module.exports = {
    name: 'duel',
    description: 'Duel a member from the server.',
    options: [
        {
            name: 'target-user',
            description: 'The user to duel.',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'amount',
            description: 'Amount to wager.',
            required: true,
            type: ApplicationCommandOptionType.Number,
        },
    ],

    callback: async (client, interaction) => {

        const amount = interaction.options.get('amount').value;

        if (amount <= 0 || !Number.isInteger(amount)) {
            interaction.reply({ content: "The amount must be a positive integer.", ephemeral: true })
            return;
        }
        const target = interaction.options.get('target-user').member; // useful to have the object as a guild member
        
        const queryUser = {
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        }

        const queryTarget = {
            userId: target.id,
            guildId: interaction.guild.id,
        }

        try {
            const userWealth = await Wealth.findOne(queryUser);
            const targetWealth = await Wealth.findOne(queryTarget);
            
            if (!userWealth || !targetWealth) {
                if (!userWealth) {
                    const newWealth = new Wealth({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                    })
                    await newWealth.save();
                }

                if (!targetWealth) {
                    const newWealth = new Wealth({
                        userId: target.id,
                        guildId: interaction.guild.id,
                    })
                    await newWealth.save();
                }

                interaction.reply({ content: "Someone didn't have a bank account!", ephemeral: true });
                return;
            }

            if (userWealth.money < amount) {
                interaction.reply({ content: "You don't have enough funds!", ephemeral: true });
            } else if (targetWealth.money < amount) {
                interaction.reply({ content: "They don't have enough funds!", ephemeral: true });
            } else {
                if (Math.random() < 0.5) {
                    // user wins
                    userWealth.money += amount;
                    await userWealth.save()
                        .catch(error => console.error(`Error saving new moneys: ${error}`));
                    targetWealth.money -= amount;
                        await targetWealth.save()
                            .catch(error => console.error(`Error saving new moneys: ${error}`));
                    interaction.reply(`<@${interaction.member.id}> you win against <@${target.id}>! You double your wager to £${2 * amount}.`);
                } else {
                    // user loses
                    targetWealth.money += amount;
                    await targetWealth.save()
                        .catch(error => console.error(`Error saving new moneys: ${error}`));
                    userWealth.money -= amount;
                        await userWealth.save()
                            .catch(error => console.error(`Error saving new moneys: ${error}`));
                    interaction.reply(`<@${interaction.member.id}> you win against <@${target.id}>! You lose your £${amount}.`);
                }
            }
        } catch (error) {
            console.error(`Error giving money: ${error}`)
        }
    }
}