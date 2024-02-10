module.exports = (date) => {
    return `<t:${Math.floor((date / 1000)).toString()}:d>`;
}