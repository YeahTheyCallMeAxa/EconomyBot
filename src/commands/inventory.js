const { Command } = require('discord.js-akago');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const { prefix } = require('../config.json')

module.exports = class InventoryCommand extends Command {
    constructor() {
        super('inventory', {
            description: 'Check your or someone else\'s inventory for items!',
            category: 'Economy',
            aliases: ["inv"]

        });
    }

    async execute(message, args) {
        const profiles = new db.table(`profiles`)
        const user = message.mentions.users.first() || message.author;
        const userProfile = profiles.get(`profiles_${user.id}`)
        if(!userProfile) return message.channel.send(user.id!==message.author.id?`The person you mentioned does not have a shop!`:`You don't have a profile!`)
        const bought = profiles.get(`profiles_${user.id}.bought`)

        try {
            const items = Object.entries(bought).map(([key, value]) => {
                return `${capitalise(key)} - ${value}`
            })

            return message.channel.send(new MessageEmbed().setColor('RANDOM')
            .setDescription(items.join('\n').toLocaleString())
            .setTitle(`**${user.tag}'s inventory:**`)
            .setTimestamp()
            .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL({ dynamic: true }))

            )
        } catch {
           if(user.id === message.author.id){
               return message.channel.send(`You don't have any items!`)
           } else{
               return message.channel.send(`The member you mentioned does not have any items!`)
           }

        }

    }
}

function capitalise(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}