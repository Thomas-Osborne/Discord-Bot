module.exports = (data) => {
    return data.sort((a, b) => b.value - a.value).filter(entry => entry.value > 0);
}