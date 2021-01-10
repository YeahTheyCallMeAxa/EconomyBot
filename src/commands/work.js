const { Command } = require('discord.js-akago');
const db = require('quick.db')
const moment = require('moment')
module.exports = class WorkCommand extends Command {
    constructor() {
        super('work', {
            description: 'Work as something to earn some coins!',
            category: 'Economy',

        });
    }

    async execute(message, args) {
        const profiles = new db.table(`profiles`)
        const memberProfile = profiles.get(`profiles_${message.author.id}`)
        if(!memberProfile) return message.channel.send(`Baka! You don't have a profile! Get one with the \`start\` command!`)
    
        

        const toWorkAs = args.join(' ')
        if(!toWorkAs) return message.channel.send(`Incorrect args! What do you want to work as?\nCorrect Args: \`work <job to work as>\``)

        const workCmd = profiles.get(`profiles_${message.author.id}.workCmd`)

        if (Date.now() > workCmd || workCmd === undefined){

            profiles.set(`profiles_${message.author.id}.workCmd`, Date.now() + 600000)

        let amount = Math.floor(Math.random() * 250) + 50; //coins to add | random gen
        let tip = Math.floor(Math.random() * 50) + 15
        const reses = [
            `**Boss:** Take \`${amount}\` coins and never come back! You can also take \`${tip}\` coins, just never come back!`,
            `Hmmm, nice work take \`${amount}\` coins oh and, \`${tip}\` coins for the hard work! *Thanos Snap*`,
            `You decided to work as a(n) **${toWorkAs}**, and you earned \`${amount + tip}\` coins!`
        ]
        const res = reses[Math.floor(Math.random() * reses.length)];
        profiles.add(`profiles_${message.author.id}.money`, amount) //work money
        profiles.add(`profiles_${message.author.id}.money`, tip) //tip money
        return message.channel.send(res);

    }else{
        return message.channel.send(`You are on a cooldown! Come back ${moment(workCmd).fromNow()}`)
    }
    



    }
}; 