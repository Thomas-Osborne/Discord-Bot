module.exports = (d) => {
    return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, date: d.getUTCDate(), hour: d.getUTCHour(), min: d.getUTCMin() };
}