const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const battleNet = require('blizzard.js');

require('dotenv').config();

module.exports = {
    name: 'card',
    description: 'Returns details of a Hearthstone card by name.',
    options: [
        {
            name: 'card-name',
            description: 'The card name for the card you want details of.',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    callback: async (client, interaction) => {

        const cardName = interaction.options.get('card-name').value;

        const hsClient = await battleNet.hs.createInstance({
            key: process.env.BATTLENET_ID,
            secret: process.env.BATTLENET_SECRET,
          })

          const card = await hsClient.card({ id: cardName });

          console.log(card.data);

          const cardDescription = card.data.text.replace(/<\/?[^>]+(>|$)/g, ""); // regex to strip HTML tags

          const embed = new EmbedBuilder()
          .setTitle(card.data.name)
          .setDescription(`${cardDescription}\n\n_${card.data.flavorText}_`)
          .addFields(
                {name: 'Mana', value: `${card.data.manaCost}`},
                {name: 'Attack', value: `${card.data.attack}`, inline: true},
                {name: 'Health', value: `${card.data.health}`, inline: true}
          )
          .setTimestamp(Date.now())
          .setThumbnail(card.data.cropImage)
          .setImage(card.data.image);

          await interaction.reply({ embeds: [embed]});
    }
}