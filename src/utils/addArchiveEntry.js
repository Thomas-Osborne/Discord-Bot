const Person = require('../models/Person');
const Message = require('../models/Message');

module.exports = async (messageId, guildId, channelId, authorId, timeStamp, archiveTitle) => {

    const message = new Message({
        messageId: messageId,
        guildId: guildId,
        channelId: channelId,
        authorId: authorId,
        timeStamp: timeStamp,
        archiveTitle: archiveTitle,
    })

    await message.save()
        .catch(error => console.error(`Error creating new message: ${error}`));

    let author = await Person.findOne({ userId: message.authorId, });

    if (!author) {
        author = new Person({
            userId: message.authorId,
            guildId: message.guildId,
        })
    }

    author.messagesArchived.push(message._id);
    await author.save()
        .catch(error => console.error(`Error adding new reaction to author: ${error}`));
}