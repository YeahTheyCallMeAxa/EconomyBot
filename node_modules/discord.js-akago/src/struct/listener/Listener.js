class Listener {
    /**
     * Creates a new listener.
     * @param {string} name - Name of the listener.
     * @param {ListenerOptions} [options] - Options for the listener.
     * @param {object} [opts={}] - Custom options for the listener class.
     */
    constructor(name, {
        once = false,
        emitter = '',
    } = {}, opts = {}) {
        /**
         * The event name that will be emitted.
         * @type {string}
         */
        this.name = String(name);
        /**
         * Whether the event will be on or once.
         * @type {boolean}
         */
        this.type = once ? 'once' : 'on';
        /**
         * The emitter of the event.
         * @type {emitter}
         */
        this.emitter = emitter;
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
         * Listener custom options used for adding options that arn't already in the listener class.
         * @type {object}
         */
        if (opts && typeof opts === 'object') this.opts = opts;
    }

}

module.exports = Listener;

/**
 * Options to use for command execution behavior.
 * @typedef {Object} ListenerOptions
 * @prop {boolean} [once='on'] Whether the event will be on or once.
 * @prop {emitter} [emitter=client] The emitter of the event. 
 */