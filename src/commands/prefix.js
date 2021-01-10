const { Command } = require('discord.js-akago');
const config = require('../config.json')

module.exports = class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            description: 'Change your prefix!',
            category: 'Misc',
            memberPermissions: ["MANAGE_GUILD"]
            

        });
    }

    async execute(message, args) {

        
        
        const db = require('quick.db')
        const prefix = args[0];
        const pdb = new db.table(`guild`)
        if(!prefix){
            return message.channel.send(`The prefix for this server is \`${pdb.get(`guild_${message.guild.id}.prefix`) || `${config.bot_prefix}`}\``)

        } 

        if(prefix === pdb.get(`guild_${message.guild.id}.prefix`)) return message.channel.send(`That is already your prefix!`)
           
        if(prefix.length > 3) return message.channel.send(`The prefix cannot be longer than 3 characters!`)
       
       
            pdb.set(`guild_${message.guild.id}.prefix`, prefix)
         
            return message.channel.send(`The prefix is now \`${prefix}\`!`)

        
        

            

        
    }
}

