const { Tracker } = require('../models');
const CronJob = require('cron').CronJob;
const { BalanceTracker } = require('./balance.tracker.service');
const { BalanceTrackerBot } = require('./discord.bot.service');
const { handleInput } = require('./cronjob.resolve.service');

let balanceTracker;

const configTracker = async (configBody) => {
    const config = await getTrackerByName(configBody.tracker)
    let updatedConfig = (config != null) ? await updateTracker(configBody) : Tracker.create(configBody);
    await startListening(updatedConfig);
    return updatedConfig;
}

const getTrackerByName = async (tracker) => {
    return Tracker.findOne({ tracker });
}

const updateTracker = async (configBody) => {
    const config  = await getTrackerByName(configBody.tracker);
    Object.assign(config, configBody);
    await config.save();
    return config; 
}

const startListening = async (config) => {
    balanceTracker = new BalanceTracker(
        config.addresses,
        config.minimum,
        new BalanceTrackerBot()
    );
    balanceTracker.subscribe("pendingTransactions");
    balanceTracker.watchTransactions();

    // initialize cron job here
    new CronJob(
        handleInput(config.schedule), // Everyday at 9:00 am
        () => {
            balanceTracker.watchBalances();
        }
    ).start();
}

const startTracker = async (name) => {
    // get default value and start the tracker
    const config = await getTrackerByName(name)
    if(config != null) {
        await startListening(config);
    }
    return config;
    

}
module.exports = {
    configTracker,
    startTracker
}