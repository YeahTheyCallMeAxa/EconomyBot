const db = require('quick.db')
const { Command } = require('discord.js-akago');
const moment = require('moment')

module.exports = class BegCommand extends Command {
    constructor() {
        super('beg', {
            description: 'Beg for money to buy some stuff!',
            category: 'Economy',

        });
    }

    async execute(message) {
        const profiles = new db.table(`profiles`);
        const memberProfile = profiles.get(`profiles_${message.author.id}`)
        if(!memberProfile) return message.channel.send(`Baka! You don't have a profile! Get one with the \`start\` command!`)
        const begCmd = profiles.get(`profiles_${message.author.id}.begCmd`)
        if (Date.now() > begCmd || begCmd === undefined){
            profiles.set(`profiles_${message.author.id}.begCmd`, Date.now() + 300000)
            
        
        
        const resesLose = [
            `Haha! You lost it all, try again next time, kiddo!`,
            `Bruh, you lost, thats fun right?`,
            `WOW! Jackpot! You earned 900M, but sadly the cops realised and took it all, sucks to suck.`,
            `You held a cup with so-called-held-head and you got nothing, nub.`
        ]
        const resLose = resesLose[Math.floor(Math.random() * resesLose.length)]
    
   
    let oneTwo; 
    oneTwo = [
        1, //win
        2, //win
        3, //win
        4, //win
        5, //win
        6,//win
        7, //win
        8, //win, again
        9, //lose
        10 //lose
    ]
    const oneOrTwo = oneTwo[Math.floor(Math.random() * oneTwo.length)]
    
    

    if(oneOrTwo === 9) { return message.channel.send(resLose) }
    else if(oneOrTwo === 10) { return message.channel.send(resLose) }
    else{
        let amount = Math.floor(Math.random() * 100) + 15;
        const resesWin = [
            `GG! You won \`${amount}\` coins, keep it up!`,
            `You earned **${amount}** coins, no it does not change anything, B-Baka!`,
            `Nice, you got \`${amount}\` coins, h a p p y  n o w ?`,
            `I hate to admit it, but you earned \`${amount}\` coins..`
        ]
        const resWin = resesWin[Math.floor(Math.random() * resesWin.length)]
        
        profiles.add(`profiles_${message.author.id}.money`, amount)
       return message.channel.send(resWin)
       
        
        } 
        


    }else{
        return message.channel.send(`You are on a cooldown! Come back ${moment(begCmd).fromNow()}`)
    }
    


  

    }
};