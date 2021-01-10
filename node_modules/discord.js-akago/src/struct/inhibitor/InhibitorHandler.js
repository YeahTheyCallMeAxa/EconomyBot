const path = require('path');
const InhibitorBase = require('./Inhibitor.js');
const rread = require('readdir-recursive');

class InhibitorHandler {
    /**
     * Loads inhibitors.
     * @param {AkagoClient} client - The Akago Client.
     * @param {inhibitorHandlerOptions} options - Options for the inhibitor handler.
     */
    constructor(client, {
        inhibitorDirectory,
    }) {
        this.client = client;

        /**
         * Path to the inhibitor directory.
         * @type {string}
         */
        this.inhibitorDirectory = path.resolve(inhibitorDirectory);

        const inhibitorsPaths = rread.fileSync(this.inhibitorDirectory);
        for (const inhibitorsPath of inhibitorsPaths) {
            this.loadInhibitor(inhibitorsPath);
        }
    }

    /**
     * Loads an inhibitor.
     * @param {string} filepath - The file path to the inhibitor.
     */
    loadInhibitor(filepath) {
        if (!filepath) throw new Error('Akago: Tried to load a inhibitor but no file path was provided.');
        const File = require(filepath);
        const inhibitor = new File(this.client);
        if (!inhibitor.execute && typeof inhibitor.execute !== 'function') throw new Error(`Akago: Inhibitor '${inhibitor.name}' doesn't have an execute function.`);
        if (!(inhibitor instanceof InhibitorBase)) return;
        if (this.client.inhibitors.has(inhibitor.name)) throw new Error(`Akago: Inhibitor '${inhibitor.name}' has already been loaded.`);
        inhibitor.filepath = filepath;
        inhibitor.client = this.client;
        this.client.inhibitors.set(inhibitor.name, inhibitor);
    }

    /**
     * Reloads an inhibitor.
     * @param {string} name - Name of the inhibitor to reload.
     */
    reloadCommand(name) {
        const inhibitor = this.client.inhibitors.get(name);
        if (!inhibitor) throw new Error(`Akago: inhibitorHandler reloadInhibitor '${name}' isn't an inhibitor`);
        delete require.cache[require.resolve(inhibitor.filepath)];
        this.client.inhibitors.delete(inhibitor.name);
        this.loadInhibitor(inhibitor.filepath);
    }
}

module.exports = InhibitorHandler;

/**
 * @typedef {Object} inhibitorHandlerOptions
 * @prop {string} inhibitorDirectory - File path to inhibitor directory.
 */