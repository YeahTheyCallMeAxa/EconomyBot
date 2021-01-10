const { AkagoClient, CommandHandler, ListenerHandler } = require('discord.js-akago');
const config = require('./src/config.json')
const db = require('./src/models/db')
const pdb = new db.table(`guild`)


class myClient extends AkagoClient {
    constructor() {
        super({
            token: config.bot_token,
            ownerID: config.owner_ID
        }, {
            disableMentions:  'everyone',
        })
        this.commandHandler = new CommandHandler(this, {
            commandDirectory: './src/commands',
            prefix: (message) => { 
                const prefix = pdb.get(`guild_${message.guild.id}.prefix`) || config.bot_prefix
                return prefix

            },
            allowMentionPrefix: true,
            blockBots: true,
        
          
           
        });
        this.listenerHandler = new ListenerHandler(this, {
            listenerDirectory: './src/events',
        });
        

        
        
    }
    start()  {
        this.build();
    }
}






const client = new myClient();
client.start()
const { MessageEmbed } = require('discord.js')

this.embed = new MessageEmbed().setColor(config.embed_colour)






