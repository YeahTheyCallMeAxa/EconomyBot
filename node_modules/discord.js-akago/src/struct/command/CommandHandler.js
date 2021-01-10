const CommandBase = require('./Command.js');
const { Collection, Permissions } = require('discord.js');
const { CommandHandlerEvents } = require('../../util/Constants.js');
const EventEmitter = require('events');
const rread = require('readdir-recursive');
const path = require('path');

class CommandHandler extends EventEmitter {
    /**
     * Loads commands and handles messages.
     * @param {AkagoClient} client - The Akago Client.
     * @param {commandHandlerOptions} options - Options for the command handler.
     * @extends {EventEmitter}
     */
    constructor(client, {
        commandDirectory,
        prefix = '!',
        allowMentionPrefix = true,
        blockBots = true,
        blockClient = true,
        ignorePermissions = [],
        ignoreCooldowns = [],
        defaultCooldown = 3,
    } = {}) {
        super();

        this.client = client;
        if (!commandDirectory || typeof commandDirectory !== 'string') {
            throw new Error('Akago: commandHandlerOptions commandDirectory either is missing or is not a string.');
        }

        /**
         * Directory to commands.
         * @type {string}
         */
        this.commandDirectory = path.resolve(commandDirectory);
        /**
         * Default command prefix(es)
         * @type {string|Array<string>|Function}
         */
        this.prefix = prefix;
        /**
         * Allows mentioning the bot as a valid prefix.
         * @type {boolean}
         */
        this.allowMentionPrefix = Boolean(allowMentionPrefix);

        /**
         * Command handler will block message's from bots.
         * @type {boolean}
         */
        this.blockBots = Boolean(blockBots);

        /**
         * Command handler will block message's from the client.
         * @type {boolean}
         */
        this.blockClient = Boolean(blockClient);

        /**
         * Array of user's IDs that will ignore permission checks.
         * @type {Array.<Snowflake>}
         */
        this.ignorePermissions = Array.isArray(ignorePermissions) ? ignorePermissions : [];

        /**
         * Array of user's IDs that will ignore command cooldowns.
         * @type {Array.<Snowflake>}
         */
        this.ignoreCooldowns = Array.isArray(ignoreCooldowns) ? ignoreCooldowns : [];

        /**
         * Default cooldown of commands that don't have their own cooldown. Set to 0 for no default cooldown.
         * @type {number}
         */
        this.defaultCooldown = Number(defaultCooldown);

        const commandPaths = rread.fileSync(this.commandDirectory);
        for (const commandPath of commandPaths) {
            this.loadCommand(commandPath);
        }

        this.client.on('message', (message) => {
            this.handle(message);
        });
    }

    /**
     * Loads a Command.
     * @param {string} filepath Path to file.
     */
    loadCommand(filepath) {
        if (!filepath) throw new Error('Akago: Tried to load a command but no file path was provided.');
        const File = require(filepath);
        const command = new File(this.client);
        if (!command.execute && typeof command.execute !== 'function') throw new Error(`Akago: Command '${command.name}' doesn't have an execute function.`);
        if (!(command instanceof CommandBase)) return;
        if (this.client.commands.has(command.name)) throw new Error(`Akago: Command '${command.name}' has already been loaded.`);
        command.filepath = filepath;
        command.client = this.client;
        this.client.commands.set(command.name, command);
        if (command.aliases.length) {
            for (const alias of command.aliases) {
                this.client.aliases.set(alias, command.name);
            }
        }
    }

    /**
     * Reloads a command.
     * @param {string} name - Name of the command.
     */
    reloadCommand(name) {
        const command = this.client.commands.get(name);
        if (!command) throw new Error(`Akago: commandHandler reloadCommand ${name} isn't a command`);
        delete require.cache[require.resolve(command.filepath)];
        this.client.commands.delete(command.name);
        this.loadCommand(command.filepath);
    }

    /**
     * Handlers messages.
     * @param {Discord.Message} message - Message to hanle. 
     */
    async handle(message) {
        if (message.author.id === this.client.user.id && this.blockClient) return;
        if (message.author.bot && this.blockBots) return;
        let prefix = this.prefix;
        if (prefix instanceof Function) prefix = await this.prefix(message);
        const mentionedPrefix = RegExp(`^<@!?${this.client.user.id}> `);
        if (prefix instanceof Array) {
            prefix = Array.isArray(this.prefix) ? this.prefix.find(pre => message.content.startsWith(pre)) : this.prefix;
        }
        if (message.content.match(mentionedPrefix) && this.mentionAsPrefix) {
            prefix = message.content.match(mentionedPrefix)[0];
        }
        if (!message.content.startsWith(prefix)) return;

        const [commandName, ...args] = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = this.client.commands.get(commandName)
            || this.client.commands.get(this.client.aliases.get(commandName));

        if (!command) return this.emit(CommandHandlerEvents.INVALID_COMMAND, message);

        const inhibitorResults = [];
        for (const inhibitor of this.client.inhibitors) {
            const inhibitorResult = await inhibitor[1].execute(message, command);
            inhibitorResults.push(inhibitorResult);
        }
        if (inhibitorResults.some((i) => i)) return;

        if (command.ownerOnly && !this.client.isOwner(message.author)) {
            return this.emit(CommandHandlerEvents.COMMAND_BLOCK, message, command, 'owner');
        }
        if (command.guildOnly && !message.guild) {
            return this.emit(CommandHandlerEvents.COMMAND_BLOCK, message, command, 'dm');
        }
        if (command.nsfw && !message.channel.nsfw) {
            return this.emit(CommandHandlerEvents.COMMAND_BLOCK, message, command, 'nsfw');
        }

        const checkValidPermission = (permArr) => {
            if (permArr.some(perm => !(Object.keys(Permissions.FLAGS)).includes(perm))) {
                throw new TypeError(`Akago: Command '${commandName}' has invalid client or member permissions.`);
            }
        };

        const checkIgnore = (user, array) => {
            const { id } = user;
            return Array.isArray(array)
                ? array.includes(id)
                : id === array;
        };

        if (!this.client.cooldowns.has(command.name)) {
            this.client.cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = this.client.cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || this.defaultCooldown) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = expirationTime - now;
                return this.emit(CommandHandlerEvents.COOLDOWN, message, command, timeLeft);
            }
        }

        if (!checkIgnore(message.author, this.ignoreCooldowns)) {
            timestamps.set(message.author.id, now);
            setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
        }

        if (command.memberPermissions.length && !checkIgnore(message.author, this.ignorePermissions)) {
            checkValidPermission(command.memberPermissions);
            if (command.memberPermissions.some(perm => !message.member.hasPermission(perm))) {
                const missingPerms = command.memberPermissions.filter(perm => !message.member.hasPermission(perm));
                return this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, 'member', missingPerms);
            }
        }

        if (command.clientPermissions && command.clientPermissions.length) {
            checkValidPermission(command.clientPermissions);
            if (command.clientPermissions.some(perm => !message.guild.me.hasPermission(perm))) {
                const missingPerms = command.clientPermissions.filter(perm => !message.guild.me.hasPermission(perm));
                return this.emit(CommandHandlerEvents.MISSING_PERMISSIONS, message, command, 'client', missingPerms);
            }
        }

        try {
            command.execute(message, args);
            this.emit(CommandHandlerEvents.COMMAND_USED, message, command);
        }
        catch (error) {
            console.warn(`There was an error while executing a command: ${error}`);
        }
    }

}

module.exports = CommandHandler;

/**
 * @typedef {Object} commandHandlerOptions
 * @prop {string} commandDirectory - File path to command directory.
 * @prop {string|Array} prefix - Prefixes for the command handler.
 * @prop {boolean} [allowMentionPrefix=true] - Allows mentioning the bot as a valid prefix.
 * @prop {boolean} [blockBots=true] - Command handler will block message's from bots.
 * @prop {boolean} [blockClient=true] - Command handler will block message's from the client.
 * @prop {Array.<Snowflake>} [ignorePermissions=[]] - Array of user's IDs that will ignore permission checks.
 * @prop {Array.<Snowflake>} [ignoreCooldown=[]] - Array of user's IDs that will ignore command cooldowns.
 * @prop {number} [defaultCooldown=3] - Default cooldown of commands that don't have their own cooldown. Set to 0 for no default cooldown.
 */

/**
 * Emitted when the client or user is missing permissions to execute a command.
 * @event CommandHandler#missingPermissions
 * @param {Discord.Message} message - The message sent.
 * @param {Command} command - The command used.
 * @param {Array} missingPerms - The permissions missing.
 */

/**
 * Emitted when a command is blocked due to it being a onlyOnly, guildOnly or NSFW command.
 * @event CommandHandler#commandBlocked
 * @param {Discord.Message} message - The message sent.
 * @param {Command} command - The command used.
 * @param {string} type - The reason the command was blocked either: owner, dm or nsfw.
 */

/**
 * Emitted when a command is used but the user is on cooldown
 * @event CommandHandler#cooldown
 * @param {Discord.Message} message - The message sent.
 * @param {Command} command - The command used.
 * @param {number} timeLeft - The time left on the cooldown in milliseconds.
 */

/**
 * Emitted when a command is successfully executed
 * @event CommandHandler#commandUsed
 * @param {Discord.Message} message - The message sent.
 * @param {Command} command - The command used.
 */

/**
 * Emitted when a command is invalid
 * @event CommandHandler#invalidCommand
 * @param {Discord.Message} message - The message sent.
 */