const { Listener } = require('discord.js-akago');

module.exports = class CommandBlockedListener extends Listener {
    constructor() {
        super('commandBlocked', {
            emitter: 'commandHandler',
            once: false,
        });
    }

    execute(message, command, reason) {
        const { name } = command;
        const reasons = {
            'nsfw': `Did you really just try to use a NSFW in a non-nsfw channel!`,
            'dm': `The ${name} command can only be used in guilds!`,
            'owner': 'This command can only be used by my owner!',
           
        };

        message.channel.send(reasons[reason]);
    }
};