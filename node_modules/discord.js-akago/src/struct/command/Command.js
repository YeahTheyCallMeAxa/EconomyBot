class Command {
    /**
     * Creates a new command.
     * @param {string} name - Name of the command.
     * @param {CommandOptions} [options={}] - Options for the command.
     * @param {opts} [opts={}] - Custom options for the command class.
     */
    constructor(name, {
        description = '',
        category = '',
        aliases = [],
        cooldown,
        ownerOnly = false,
        guildOnly = true,
        nsfw = false,
        memberPermissions = [],
        clientPermissions = [],
    } = {}, opts = {}) {
        /**
         * Name of the command
         * @type {string}
         */
        this.name = typeof name === 'string' ? name : '';
        /**
         * Description of the command.
         * @type {string}
         */
        this.description = typeof description === 'string' ? description : '';
        /**
         * Category of the command
         * @type {string}
         */
        this.category = typeof category === 'string' ? category : '';
        /**
         * Aliases of the command.
         * @type {Array}
         */
        this.aliases = Array.isArray(aliases) ? aliases : [];
        /**
         * The command cooldown in seconds.
         * @type {number}
         */
        this.cooldown = typeof cooldown === 'number' ? cooldown : null;
        /**
         * Whether or not to allow client owner(s) only.
         * @type {boolean}
         */
        this.ownerOnly = Boolean(ownerOnly);
        /**
         * Whether or not the commans can only be used in a guild
         * @type {boolean}
         */
        this.guildOnly = Boolean(guildOnly);
        /**
         * Whether the command can only be done in a NSFW channel. 
         * @type {boolean}
         */
        this.nsfw = Boolean(nsfw);
        /**
         * Permissions required by the member to run this command.
         * @type {PermissionResolvable[]}
         */
        this.memberPermissions = Array.isArray(memberPermissions) ? memberPermissions : [];
        /**
         * Permissions required by the client to run this command.
         * @type {PermissionResolvable[]}
         */
        this.clientPermissions = Array.isArray(clientPermissions) ? clientPermissions : [];
        /**
         * The Akago Client.
         * @type {AkagoClient}
         */
        this.client;
        /**
         * The file path to the command.
         * @type {string}
         */
        this.filepath;
        /**
         * Command custom options used for adding options that arn't already in the command class.
         * @type {object}
         */
        if (opts && typeof opts === 'object') this.opts = opts;
    }

}

module.exports = Command;

/**
 * Options to use for command execution behavior.
 * @typedef {Object} CommandOptions
 * @prop {string} [description=''] - Description of the command.
 * @prop {string} [category] - Category of the command.
 * @prop {string} [aliases=[]] - Aliases of the command.
 * @prop {boolean} [ownerOnly=false] - Whether or not to allow client owner(s) only.
 * @prop {number} [cooldown=null] - The command cooldown in seconds.
 * @prop {PermissionResolvable[]} [memberPermissions=[]] - Permissions required by the member to run this command.
 * @prop {PermissionResolvable[]} [clientPermissions=[]] - Permissions required by the client to run this command.
 * @prop {boolean} [guildOnly=true] - Whether or not the commans can only be used in a guild
 * @prop {boolean} [nsfw=false] - Whether the command can only be done in a NSFW channel. 
 */