const { time } = require('discord.js');
const forecastsData = require('../../../forecasts.json');
const formatTime = require('../../utils/formatTime.js');

module.exports = {
    name: 'forecast',
    description: 'Retrieves forecast information.',

    callback: (client, interaction) => {
        const NUMBER_OF_FORECASTS = 48;
        const TOTAL_BATTERY_CAPACITY = 24.3;
        const MAX_CHARGING_HOURS = 6;
        const AV_BATTERY_VOLTAGE = 52;
        const MAX_CURRENT = 70;
        const DAILY_USAGE = 18;

        let desiredIncrease;
        let chargingHours;

        forecasts = forecastsData.forecasts;
        let times = []
        let index;

        currentTime = new Date();
        // currentTime = new Date(2024, 1, 11, 2, 1, 1, 0);
        console.log(currentTime);
        console.log(currentTime.getHours());
        if (currentTime.getHours() <= 5) {
            console.log("Time before 5")
        } else {
            console.log("Time after 5");
        }


        let analysedData = [];
        
        for (let i = 0; i < forecasts.length; i++) {
            forecasts[i].period_end = new Date(forecasts[i].period_end); // make it a date object for ease
            console.log(forecasts[i].period_end);
            times.push(forecasts[i].period_end.getTime());
        }

        const today = forecasts[0].period_end;

        const todaysDate = forecasts[0].period_end.getUTCDate();
        const tomorrowsDate = today.getDate() + 1;

        if (currentTime.getHours() <= 5) {
            console.log("Time between 00:00 and 05:00: show today's data.");
            chargingHours = MAX_CHARGING_HOURS - currentTime.getHours() - 1;

            for (let i = 0; i < forecasts.length; i++) {
                if (forecasts[i].period_end.getUTCDate() === todaysDate) {
                    analysedData.push(forecasts[i]);
                } else {
                break;
                }
            }
            index = 0;
        } else { 
            console.log("Time after 05:00: show tomorrow's data.");
            chargingHours = MAX_CHARGING_HOURS;
            for (let i = 0; i < forecasts.length; i++) {
                if (forecasts[i].period_end.getUTCDate() === todaysDate) {
                    continue;
                } else if (forecasts[i].period_end.getUTCDate() === tomorrowsDate) {
                    analysedData.push(forecasts[i]);
                } else {
                    break;
                }
            }
        }

        console.log(chargingHours);

        console.log(analysedData);

        let message = '';
        for (let i = index; i < index + NUMBER_OF_FORECASTS; i++) {
            message += `${formatTime(times[i])}\n`;

        }

        desiredIncrease = 32;

        let kwPerHoursRequired = (TOTAL_BATTERY_CAPACITY) * (desiredIncrease) / 100;
        let kwPerHourRate = (kwPerHoursRequired) / Math.min(chargingHours, MAX_CHARGING_HOURS);
        let current = Math.min(kwPerHourRate * 1000 / AV_BATTERY_VOLTAGE, MAX_CURRENT);

        console.log(kwPerHoursRequired);
        interaction.reply(`current: ${Math.round(current * 100) / 100}`); // round to 2dp
    
    
    }
}