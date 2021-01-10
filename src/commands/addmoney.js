
const db = require('quick.db');
const { Command } = require('discord.js-akago');

module.exports = class AddMoneyCommand extends Command {
    constructor() {
        super('addmoney', {
            category: 'Owner',
            ownerOnly: true
           

        });
    }

    async execute(message, args) {
        const profiles = new db.table('profiles')
        const member = message.mentions.users.first() || message.author;
        const memberProfile = profiles.get(`profiles_${member.id}`)
    
        if(!memberProfile) return message.reply(member.id!==message.author.id?`This member doesn't even have a shop!`:`You don't have a profile!`)
    
    

    
        if(!args[1]) return message.channel.send('You need to define a number!')
    
        if(isNaN(args[1]) || args[1] < 0) return message.channel.send('You need to specify a number that is above 1!')
        profiles.add(`profiles_${member.id}.money`, args[1])
        profiles.add(`profiles_${member.id}.totalMoney`, args[1])
    
    
        return message.channel.send(`Added **${args[1].toLocaleString()}** coins to **${member.tag}**`)
    }
}; 