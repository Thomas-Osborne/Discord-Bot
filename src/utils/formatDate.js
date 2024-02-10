module.exports = (date) => {
    return `<t:${Math.floor((Date.now() / 1000)).toString()}:d>`;
}