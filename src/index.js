const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');

// const CornJob = require("cron").CronJob;
// const { BalanceTracker } = require("./balanceTracker");
// const { BalanceTrackerBot } = require("./discordBot");

let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    // Log connection here
    logger.info('Connected to MongoDB');
    server = app.listen(config.port, () => {
        // log server connection here
        logger.info(`Listening to port ${config.port}`);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
        logger.info('Server closed');
        process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});


// router.post("/conf", (request, response) => {
//     // update configuration in database
    
// });

// router.post("/start", (request, response) => {
//     // Update configuration on the server and start listening
//     // TODO: provide accounts and minimum value from db.

//     let balanceTracker = new BalanceTracker(
//         request.body.addresses,
//         request.body.minimum,
//         new BalanceTrackerBot()
//     );
//     balanceTracker.subscribe("pendingTransactions");
//     balanceTracker.watchTransactions();

//     // TODO: convert frequency into cron job
//     new CornJob(
//         '0 0 9 * * *', // Everyday at 9:00 am
//         () => {
//             balanceTracker.watchBalances();
//         }
//     ).start();

//     response.json({});
// })

// app.use("/", router);
// app.listen(3000, () => {
//     console.log("Server running on PORT 3000");
// });

