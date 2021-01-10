
const db = require('quick.db');
const { Command } = require('discord.js-akago');

module.exports = class RemoveMoneyCommand extends Command {
    constructor() {
        super('removemoney', {
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
        const oldbal = (`profiles_${member.id}.money`)
    
        if(oldbal - args[1] < 0) message.channel.send(`I cant remove this much, the bal will go below 0`)
        profiles.subtract(`profiles_${member.id}.money`, args[1])
    
        return message.channel.send(`Removed **${args[1].toLocaleString()}** coins from **${member.tag}**'s bal`)
    
    


    }
}