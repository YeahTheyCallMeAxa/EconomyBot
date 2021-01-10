module.exports = {
    // Core
    AkagoClient: require('./struct/AkagoClient'),

    // Commands
    ListenerHandler: require('./struct/listener/ListenerHandler'),
    Listener: require('./struct/listener/Listener'),
    
    // Listeners
    CommandHandler: require('./struct/command/CommandHandler'),
    Command: require('./struct/command/Command'),

    // INHIBITORS
    Inhibitor: require('./struct/inhibitor/Inhibitor'),
    InhibitorHandler: require('./struct/inhibitor/InhibitorHandler'),
}; 