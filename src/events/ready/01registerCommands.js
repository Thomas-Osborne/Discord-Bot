const { testServer } = require('../../../config.json');
const areCommandsDifferent = require('../../utils/areCommandsDifferent');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = async (client) => {
    try {
        const localCommands = getLocalCommands();
        const applicationCommands = await getApplicationCommands(client, testServer);

        for (const localCommand of localCommands) {
            const { name, description, options } = localCommand;
            const existingCommand = await applicationCommands.cache.find(command => command.name === name)

            if (existingCommand) {
                // delete command
                if (localCommand.deleted) {
                    await applicationCommands.delete(existingCommand.id);
                    console.log(`Deleted command ${name}.`);
                    continue;
                }

                // edit command
                if (areCommandsDifferent(existingCommand, localCommand)) {
                    await applicationCommands.edit(existingCommand.id, {
                        description,
                        options,
                    })

                    console.log(`Edited command ${name}.`);
                }
            } else {
                // do not register a command with deleted set to true
                if (localCommand.deleted) {
                    console.log(`Skipping registering command ${name} as it is set to delete.`);
                    continue;
                }

                // register commands
                await applicationCommands.create({
                    name,
                    description,
                    options,
                })

                console.log(`Registered command ${name}.`)
            }
        }
    } catch (error) {
        console.log(`Error: ${error}`);
    }
}