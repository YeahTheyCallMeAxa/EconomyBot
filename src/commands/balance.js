const { Command } = require('discord.js-akago');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
module.exports = class BalanceCommand extends Command {
    constructor() {
        super('balance', {
            description: 'Check your or someone else\'s balance!',
            category: 'Profile',
            aliases: ["bal", "wallet", "money", "cash", "coins"]

        });
    }

    async execute(message) {
        
        const member = message.mentions.users.first() || message.author;
        const memberID = member.id;
        const profiles = new db.table(`profiles`);
        const memberProfile = profiles.get(`profiles_${memberID}`)
        if(!memberProfile) return message.channel.send(memberID!==message.author.id?`The person you mentioned does not have a profile!`:`You don't have a profile!`)
        const balance = profiles.get(`profiles_${memberID}.money`) || 0
       
            return message.channel.send(new MessageEmbed().setColor(require('../hexcode'))
            .setAuthor(`${this.client.user.username} | Balance`, this.client.user.displayAvatarURL({ dynamic: true }))
            .addField(this.client.users.cache.get(memberID).username + `'s balance:`, `**__${balance.toLocaleString()}__** coins`)
            .setFooter(memberID!==message.author.id ? `Requested by ${message.author.tag}` : `Thank you for using ${this.client.user.username}!`, message.author.displayAvatarURL({ dynamic: true }))
            )
        
    
        
        
    }
}; 