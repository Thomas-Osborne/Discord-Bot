const forecastsData = require('../../../forecasts.json');
const formatTime = require('../../utils/formatTime.js');

module.exports = {
    name: 'forecast',
    description: 'Retrieves forecast information.',

    callback: (client, interaction) => {
        forecasts = forecastsData.forecasts;

        for (let i = 0; i < forecasts.length; i++) {
            forecasts[i].period_end = new Date(forecasts[i].period_end); // make it a date object for ease
            forecasts[i].period_end = forecasts[i].period_end.getTime();
        }

        interaction.reply(formatTime(forecasts[0].period_end));
    }
}