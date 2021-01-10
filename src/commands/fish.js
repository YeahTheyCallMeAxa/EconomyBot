const { Command } = require('discord.js-akago');
const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const db = require('quick.db')
module.exports = class FishCommand extends Command {
    constructor() {
        super('fish', {
            description: 'Fish for fishes and sell them or collect them!',
            category: 'Economy',
    

        });
    }

    async execute(message, args) {

        const { client } = this;

        const profiles = new db.table(`profiles`)
        const memberProfile = profiles.get(`profiles_${message.author.id}`)
        if(!memberProfile) return message.channel.send(`:hamburger: || You can't use this command because you don't have a profile! Get a profile by using the \`start\` command!`)
       
       
        const fishCmd = profiles.get(`profiles_${message.author.id}.fishCmd`)
       


if (Date.now() > fishCmd || fishCmd === undefined){
    const bought = profiles.get(`profiles_${message.author.id}.bought`)
    const fishh = 'Fishing-pole'

    if(!profiles.get(`profiles_${message.author.id}.bought.fishing-pole`)){
        return message.channel.send(`You don't have any items to fish with! You need to have a fishing pole!`)
    }

    let fish = [
        "goldfish",
        "catfish",
        "fish",
        "shark",
        "dolphin"
        ]
  
        let fishresult = Math.floor((Math.random() * fish.length));
        let amount = Math.floor(Math.random() * 1000) + 1;
        profiles.set(`profiles_${message.author.id}.fishCmd`, Date.now() + 600000)
        
       
      
            message.channel.send(new MessageEmbed().setColor('RANDOM')
            .setDescription(`You went fishing and caught a **\`${capitalise(fish[fishresult])}\`**!\nDo you want to sell this fish or store it in your inventory? (Reply with \`yes\` with you want to sell it)`)
            .setTitle('Fishing')
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            );
            const fitler = (user) => {
                return user.author.id === message.author.id
            }
            
            message.channel.awaitMessages(fitler, { max: 1, time: 60000, erros: ['time'] })
            .then(collected => {
                const msg = collected.first().content
                if(msg === 'yes'){
                    profiles.add(`profiles_${message.author.id}.money`, amount)

                    return message.channel.send(`You sold your fish (${capitalise(fish[fishresult])}) for ${amount} coins, any good now?`)
                }else if(msg === 'Yes'){
                    profiles.add(`profiles_${message.author.id}.money`, amount)

                    return message.channel.send(`You sold your fish (${capitalise(fish[fishresult])}) for ${amount} coins, any good now?`)
                }else{
                    profiles.add(`profiles_${message.author.id}.bought.${fish[fishresult]}`, 1)
                    return message.channel.send(`Uhh, what? Anyways, I have added (${capitalise(fish[fishresult])}) to your inventory!`)
                }

            })
            .catch(() => {
                return message.reply('You have run out of time to decide, therefor you have lost your fish, HAHA nub!')
            })
            
            
        
       
        

    
} else {
    return message.channel.send(`You are on a cooldown! Come back ${moment(fishCmd).fromNow()}!`)
}




    }
}

function capitalise(string){
    return string.charAt(0).toUpperCase() + string.slice(1)
}