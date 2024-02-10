module.exports = (date) => {
    d = new Date();
    console.log(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());

    return `<t:${Math.floor((date / 1000)).toString()}:d>`;
}