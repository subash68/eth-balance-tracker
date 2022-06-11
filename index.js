const express = require("express");
const bodyParser = require("body-parser");
const CornJob = require("cron").CronJob;
const { BalanceTracker } = require("./balanceTracker");
const { BalanceTrackerBot } = require("./discordBot");

const router = express.Router();
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

router.post("/start", (request, response) => {
    // Update configuration on the server and start listening
    // TODO: provide accounts and minimum value from db.

    let balanceTracker = new BalanceTracker(
        request.body.addresses,
        request.body.minimum,
        new BalanceTrackerBot()
    );
    balanceTracker.subscribe("pendingTransactions");
    balanceTracker.watchTransactions();

    // TODO: convert frequency into cron job
    new CornJob(
        '0 0 9 * * *', // Everyday at 9:00 am
        () => {
            balanceTracker.watchBalances();
        }
    ).start();

    response.json({});
})

app.use("/", router);
app.listen(3000, () => {
    console.log("Server running on PORT 3000");
});

