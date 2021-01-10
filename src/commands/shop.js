const { Command } = require('discord.js-akago');
const db = require('quick.db')
const config = require('../config.json')
module.exports = class ShopCommand extends Command {
    constructor() {
        super('shop', {
            description: 'Check out the store to buy stuff!',
            category: 'Profile',
            aliases: ["market"]

        });
    }

    async execute(message, args) {

        const { MessageEmbed } = require('discord.js')

        const { client } = this;
        

        const p = new db.table(`profiles`)
        const memberProfile = p.get(`profiles_${message.author.id}`)
        if(!memberProfile) return message.channel.send(`Baka! You don't have a profile! Get one with the \`start\` command!`)
        const prefix = config.bot_prefix
       
        const member = message.member.id
        const money = p.get(`profiles_${member}.money`)
        const id = message.author.id;

       
        const hunting = p.get(`profiles_${id}.bought.hunting-rifle`)
        const fishing = p.get(`profiles_${id}.bought.fishing-pole`)


const embed4 = new MessageEmbed().setColor(config.embed_colour)
.setAuthor(`${client.user.username} - Shop`, client.user.displayAvatarURL())
.addField(`Hunting Rifle`, [`**Usage:** \`Can be used to hunt animals\``, `**Cost:** \`${(hunting * 5000 || 5000).toLocaleString()}\` coins`, `**ID:** \`hunting-rifle\``].join('\n'))
.addField(`Fishing Pole`, [`**Usage:** \`Can be used to hunt fishs\``, `**Cost:** \`${(fishing * 5000 || 5000).toLocaleString()}\` coins`, `**ID:** \`fishing-pole\``].join('\n'))
.addField(`Information:`, `Your balance: $${money.toLocaleString()}\nBuy something with: \`${prefix}buy <item ID>\``)

message.channel.send(embed4)



    }
};