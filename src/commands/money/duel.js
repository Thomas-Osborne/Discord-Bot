const { ApplicationCommandOptionType } = require('discord.js');
const User = require('../../models/User');

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
        
        const queryTargeter = {
            userId: interaction.user.id,
            guildId: interaction.guild.id,
        }

        const queryTarget = {
            userId: target.id,
            guildId: interaction.guild.id,
        }

        try {
            const targeterUser = await User.findOne(queryTargeter);
            const targetUser = await User.findOne(queryTarget);
            
            if (!targeterUser || !targetUser) {
                if (!targeterUser) {
                    const newUser = new User({
                        userId: interaction.user.id,
                        guildId: interaction.guild.id,
                    })
                    await newUser.save();
                }

                if (!targetUser) {
                    const newUser = new User({
                        userId: target.id,
                        guildId: interaction.guild.id,
                    })
                    await newUser.save();
                }

                interaction.reply({ content: "Someone didn't have a bank account!", ephemeral: true });
                return;
            }

            if (targeterUser.money < amount) {
                interaction.reply({ content: "You don't have enough funds!", ephemeral: true });
            } else if (targetUser.money < amount) {
                interaction.reply({ content: "They don't have enough funds!", ephemeral: true });
            } else {
                if (Math.random() < 0.5) {
                    // user wins
                    targeterUser.money += amount;
                    await targeterUser.save()
                        .catch(error => console.error(`Error saving new moneys: ${error}`));
                    targetUser.money -= amount;
                        await targetUser.save()
                            .catch(error => console.error(`Error saving new moneys: ${error}`));
                    interaction.reply(`<@${interaction.member.id}> you win against <@${target.id}>! You double your wager to £${2 * amount}.`);
                } else {
                    // user loses
                    targetUser.money += amount;
                    await targetUser.save()
                        .catch(error => console.error(`Error saving new moneys: ${error}`));
                    targeterUser.money -= amount;
                        await targeterUser.save()
                            .catch(error => console.error(`Error saving new moneys: ${error}`));
                    interaction.reply(`<@${interaction.member.id}> you lose against <@${target.id}>! You lose your £${amount}.`);
                }
            }
        } catch (error) {
            console.error(`Error giving money: ${error}`)
        }
    }
}