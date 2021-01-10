const { Command } = require('discord.js-akago');
const { MessageEmbed } = require('discord.js');

const config = require('../config.json')
module.exports = class HelpCommand extends Command {
    constructor() {
        super('help', {
            description: 'Display a list of all commands I have.',
            category: 'Misc',
            aliases: ["commands", "h", "cmds"]
        });
    }

    async execute(message, [commandName]) {
        
        const prefix = config.bot_prefix
        const { commands, util } = this.client;
        const embed = new MessageEmbed().setColor(config.embed_colour);
        const command = commands.get(commandName);

        if (command) {
            embed.setTitle(`\`${command.name}\``);
            embed.addField('Description', command.description);
            if (command.aliases.length) {
                embed.addField('Aliases', command.aliases.map(a => `\`${a}\``).join(', '));
            }
        }
        else {
            const categories = util.removeDuplicates(commands.map(c => c.category)).filter(c => c !== 'Owner');
            embed.setDescription(`Total Commands: \`${this.client.commands.size}\`| For additional info on a command, use \`${prefix}help <command>\`\nBot coded by [Axa](https://bit.ly/invmikio)`);
            for (const category of categories) {
                const filteredCommands = commands.filter(c => c.category == category);
               
                embed.addFields([{
                    name: category || 'Misc',
                    value: filteredCommands.map(c => `\`${c.name}\``).join(', '),
                }]);
            }
        }

        message.channel.send(embed);
    }
}; 