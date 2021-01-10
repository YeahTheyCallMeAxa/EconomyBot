const { Listener } = require('discord.js-akago');

module.exports = class MissingPermissionsListener extends Listener {
    constructor() {
        super('missingPermissions', {
            emitter: 'commandHandler',
            once: false,
        });
    }

    execute(message, command, type, missing) {
        const emojis = [ 
            '🐃',
            '🍉',
            '💅',
            '🌺',
            '🧡',
            '😄',
            '🤡'
        ]
        let emoji = emojis[Math.floor(Math.random() * emojis.length)]
        const perms = missing.map(p => p.replace(/_/g, ' ').toLowerCase()).join(', ');
        const user = type === 'client' ? 'I am' : 'You are';
        const { name } = command;
        if(user.type === 'client'){
            return message.channel.send(`${emoji} || I do not have the permissions to use \`${name}\`! Please give me the \`${perms}\` permissions!`)
        } else{
            return message.channel.send(`${emoji} || You need the \`${capitalise(perms)}\` permissions to use \`${name}\` command!`)
        }
    }
};

function capitalise(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}