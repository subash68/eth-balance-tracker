const { Tracker } = require('../models');
const { BalanceTracker } = require('./balance.tracker.service');
const { BalanceTrackerBot } = require('./discord.bot.service');
// call balance tracker
// call bot service here


const configTracker = async (configBody) => {
    return Tracker.create(configBody);
}

const getTrackerByName = async (tracker) => {
    return Tracker.find({ tracker });
}

const updateTrakcer = async (configBody) => {
    const config  = await getTrackerByName(configBody.name);
    if (config.length == 1) {
        // update config here
    }
}

const startTracker = async (name) => {
    // get default value and start the tracker
    const config = await getTrackerByName(name)

    if (config.length == 1) {
        let parsedConfig = config[config.length - 1];
        let balanceTracker = new BalanceTracker(
            parsedConfig.addresses,
            parsedConfig.minimum,
            new BalanceTrackerBot()
        );
        balanceTracker.subscribe("pendingTransactions");
        balanceTracker.watchTransactions();

        // initialize cron job here
    }
    return false;
}

module.exports = {
    configTracker,
    startTracker
}