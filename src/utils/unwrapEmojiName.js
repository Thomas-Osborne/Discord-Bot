module.exports = (id, name) => {
    if (id) {
        emojiStr = `<:${name}:${id}>`;
    } else {
        emojiStr = name;
    }

    return emojiStr;
}