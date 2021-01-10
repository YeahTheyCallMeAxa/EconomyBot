class Inhibitor {
    /**
     * Creates a new command.
     * @param {string} name - Name of the inhibitor.
     * @param {opts} [opts={}] - Custom options for the inhibitor class.
     */
    constructor(name, opts = {}) {
        /**
         * The name of the inhibitor
         * @type {string}
         */
        this.name = typeof name === 'string' ? name : '';
        /**
         * Custom options for the inhibitor
         * @type {object}
         */
        if (opts && typeof opts === 'object') this.opts = opts;
    }
}

module.exports = Inhibitor;