const ListenerBase = require('./Listener.js');
const path = require('path');
const rread = require('readdir-recursive');

class ListenerHandler {
    /**
     * Loads commands and handles messages.
     * @param {AkagoClient} client - The Akago Client.
     */
    constructor(client, {
        listenerDirectory,
    }) {
        this.client = client;
        
        if (!listenerDirectory || typeof listenerDirectory !== 'string') {
            throw new Error('Akago: listenerHandlerOptions listenerDirectory either is missing or is not a string.');
        }

        /**
         * Directory to listeners.
         * @type {string}
         */
        this.listenerDirectory = path.resolve(listenerDirectory);

        const listenerPaths = rread.fileSync(this.listenerDirectory);
        for (const listenerPath of listenerPaths) {
            this.loadListener(listenerPath);
        }
    }

    /**
     * Loads a Listener.
     * @param {string} filepath Path to file.
     */
    loadListener(filepath) {
        const File = require(filepath);
        const listener = new File(this.client);
        if (!listener.execute && typeof listener.execute !== 'function') throw new Error(`Akago: Listener '${listener.name}' doesn't have an execute function.`);
        if (!(listener instanceof ListenerBase)) return;
        if (this.client.events.has(listener.name)) throw new Error(`Akago: Listener '${listener.name}' has already been loaded.`);
        listener.client = this.client;
        listener.filepath = filepath;
        const emitter = (typeof listener.emitter === 'string' ? this.client[listener.emitter] : listener.emitter) || this.client;
        this.client.events.set(listener.name, listener);
        emitter[listener.type](listener.name, (...args) => listener.execute(...args));
    }

    /**
     * Reloads a listener
     * @param {string} name - Name of the listener wanted to reload.
     */
    reloadListener(name) {
        const listener = this.client.events.get(name);
        if (!listener) throw new Error(`Akago: listenerHandler reloadListener ${name} isn't a event.`);
        delete require.cache[require.resolve(listener.filepath)];
        this.client.events.delete(listener.name);
        const emitter = (typeof listener.emitter === 'string' ? this.client[listener.emitter] : listener.emitter) || this.client;
        emitter.removeListener(listener.eventName, listener.execute);
        this.loadListener(listener.filepath);
    }

}

module.exports = ListenerHandler;

/**
 * @typedef {Object} listenerHandlerOptions
 * @prop {string} listenerDirectory - File path to listener directory.
 */