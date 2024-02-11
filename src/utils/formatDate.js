module.exports = (date) => {
    d = new Date();

    return `<t:${Math.floor((date / 1000)).toString()}:d>`;
}