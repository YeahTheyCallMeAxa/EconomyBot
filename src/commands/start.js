const { Command } = require('discord.js-akago');

module.exports = class StartCommand extends Command {
    constructor() {
        super('start', {
            description: 'Start your own profile to earn money!',
            category: 'Profile',
            aliases: ["newprofile"]

        });
    }

    async execute(message, args) {
        const db = require('quick.db')
        const profiles = new db.table("profiles")


const userProfile = profiles.get(`profiles_${message.author.id}`)




if(userProfile) return message.channel.send(`Your stupidity triggers me, you already have a profile, Baka!`)




message.channel.send(`What do you want your profile to be called?`)

const fitler = (user) => {
    return user.author.id === message.author.id
}

message.channel.awaitMessages(fitler, { max: 1, time: 60000, erros: ['time'] })
.then(collected => {
    const name = collected.first().content
    const regex = !/[a-zA-Z0-9 ]+/g.test(name)

    if(regex) message.reply(`Your profile name can only contain numbers and letters!`)

    profiles.set(`profiles_${message.author.id}.name`, name)
    profiles.set(`profiles_${message.author.id}.money`, 50)
    profiles.set(`profiles_${message.author.id}.bought.laptop`, 1)
    return message.channel.send(`Your profile named ${name} has been created! :tada:`)

})
.catch(() => {
  
    return message.channel.send('You have run out of time to create a shop!')
})


       
    }
}; 