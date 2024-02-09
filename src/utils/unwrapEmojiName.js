module.exports = (id, name) => {
    console.log(id);
    console.log(name);
    if (id) {
        emojiStr = `<:${name}:${id}>`;
    } else {
        emojiStr = name;
    }

    return emojiStr;
}