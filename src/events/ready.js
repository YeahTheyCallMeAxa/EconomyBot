const { Listener } = require('discord.js-akago');

module.exports = class Ready extends Listener {
  constructor() {
    super('ready', {
      once: false,
    })
  }

  async execute() {
      const config = require('../config.json') // Load up the config.json file
      const id = config.bot_channelID // Load up your bot's channel ID
      const { client } = this; // Prevents us from typing `this.client` all the time
      const channel = client.channels.cache.get(config.bot_channelID) // Load up the channel to send messages at.

      const memberStat = `members` /*
      The line above can help us check if the bot only supports 1 member, if so, it will write "member"
      and not "members"
      */

      const guildStat = `guilds` /*
      The line above can check if the bot is only in 1 server, if so it will write "guild"
      else, it'll write "guilds" 
      
      */
try{
    console.log(`Hello! I'm online as ${client.user.tag}!\nBot coded by Axa!`)
     channel.send(`Hello! I'm currently online in ${client.guilds.cache.size} ${guildStat}, with ${client.users.cache.size} ${memberStat}!`)

        /*
          Function to cactch/return if your bot channel ID is wrong
          This function is already built with javascript, i didnt make it, hehe
          */


} catch(err){
    return console.log(err); 
     /*
          Function to cactch/return if your bot channel ID is wrong
          This function is already built with javascript, i didnt make it, hehe
          */
};


client.user.setActivity(require(`../models/ayo`), { type: 'WATCHING' })
      
      

    
  }
};


