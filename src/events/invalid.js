const { Listener } = require('discord.js-akago');

module.exports = class InvliadCommandListener extends Listener {
  constructor() {
    super('invalidCommand', {
      emitter: 'commandHandler',
      once: false,
    })
  }

  async execute(message) {
    const emojis = [ 
        '🐃',
        '🍉',
        '💅',
        '🌺',
        '🧡',
        '😄',
        '🤡'
    ]
    let emoji = emojis[Math.floor(Math.random() * emojis.length)]

    await message.channel.send(`${emoji} || That isn't a command you buffalo!`)
  }
}
