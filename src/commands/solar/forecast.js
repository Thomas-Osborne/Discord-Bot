const { time } = require('discord.js');
const forecastsData = require('../../../forecasts.json');
const formatTime = require('../../utils/formatTime.js');

module.exports = {
    name: 'forecast',
    description: 'Retrieves forecast information.',

    callback: (client, interaction) => {
        const NUMBER_OF_FORECASTS = 48;
        const TOTAL_BATTERY_CAPACITY = 24.3;
        const MAX_CHARGING_TIME = 360;
        const AV_BATTERY_VOLTAGE = 52;
        let desiredIncrease;
        let earliestHour;

        forecasts = forecastsData.forecasts;
        let times = []
        let index;

        currentTime = new Date();

        if (currentTime.getHours() <= 5) {
            console.log("Time before 5")
        } else {
            console.log("Time after 5");
        }

        
        for (let i = 0; i < forecasts.length; i++) {
            forecasts[i].period_end = new Date(forecasts[i].period_end); // make it a date object for ease
            console.log(forecasts[i].period_end);
            times.push(forecasts[i].period_end.getTime());
        }

        console.log("HERE", forecasts[0].period_end.getUTCHours());

        if (forecasts[0].period_end.getUTCHours() <= 5) {
            console.log("Time between 00:00 and 05:00: show today's data.");
            index = 0;
        } else { 
            console.log("Time after 05:00: show tomorrow's data.");
            for (let i = 0; i < forecasts.length; i++) {
                if (forecasts[i].period_end.getUTCHours() == 0) {
                    index = i;
                    break;
                }
            }
        }

        let message = '';
        for (let i = index; i < index + NUMBER_OF_FORECASTS; i++) {
            message += `${formatTime(times[i])}\n`;

        }

        desiredIncrease = 50;

        let kwPerHour = (TOTAL_BATTERY_CAPACITY * (desiredIncrease / 100)) / (MAX_CHARGING_TIME / 60);
        let current = kwPerHour * 1000 / AV_BATTERY_VOLTAGE;

        interaction.reply(message);
    
    
    }
}