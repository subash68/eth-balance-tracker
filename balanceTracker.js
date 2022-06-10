const Web3 = require("web3");
const { action, message, content } = require('./config.json');

require("dotenv").config();

class BalanceTracker {
    web3;
    web3ws;
    minimum;
    subscription;
    tracker;

    // to track multiple accounts
    accounts;

    constructor(accounts, minimum, tracker) {
        this.web3ws = new Web3(
            new Web3.providers.WebsocketProvider(
                process.env.AVALANCHE_NODE_WSS
            )
        );
        this.web3 = new Web3(
            new Web3.providers.HttpProvider(
            process.env.AVALANCHE_NODE_HTTPS
            )
        );

        // Read from db and update variables here

        // this.account = account.toLowerCase();
        this.accounts = accounts.map((account) => { return account.toLowerCase() });
        this.minimum = minimum;
        this.tracker = tracker;
    }

    subscribe(topic) {
        this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
            if (err) console.error(err);
        });
    }

    // returns message and content
    handleActionMessage(account, value) {
        //TODO: Read minimum from database

        return (value < this.minimum) ? {

            message: account + message["alert"] + parseFloat(value).toFixed(4),
            content: content["alert"],
            type: action["alert"]
        } : { 
            message: account + message["info"] + parseFloat(value).toFixed(4),
            content: content["info"],
            type: action["info"]
        }
    }

    async watchBalances() {
        try {
            if(
                this.accounts != undefined && 
                this.accounts != null && 
                this.accounts.length > 0
            ) {

                let response = await this.accounts.map(async (account) => {
                    return {
                        account: account,
                        value: this.web3.utils.fromWei(
                            await this.web3.eth.getBalance(account), "ether"),
                        timestamp: new Date() 
                    }
                });

                response.forEach((info) => {
                    info.then((data) => {
                        let actionMessage = this.handleActionMessage(data.account, data.value);
                        this.tracker.postMessage(
                            actionMessage.content,
                            actionMessage.message,
                            actionMessage.type
                        );
                    });
                });

                
            }
        } catch(err) {
            console.log(err);
        }
    }

    // async watchBalance() {
    //     try {
    //         if(this.account != undefined && this.account != null) {
    //             let response = {
    //                 account: this.account,
    //                 value: this.web3.utils.fromWei(
    //                     await this.web3.eth.getBalance(this.account), "ether"),
    //                 timestamp: new Date()
    //             };

    //             let actionMessage = this.handleActionMessage(response.value);
    //             this.tracker.postMessage(
    //                 actionMessage.content,
    //                 actionMessage.message,
    //                 actionMessage.type
    //             );
    //         }
    //     } catch(err) {
    //         console.log(err);
    //     }
    // }

    watchTransactions() {
        this.subscription.on("data", (txHash) => {
            setTimeout(async () => {
            try {
                let tx = await this.web3.eth.getTransaction(txHash);
                if (tx != null) {
                    if (this.accounts.includes(tx.from.toLowerCase())) {
                        let response = {
                            address: tx.from,
                            value: this.web3.utils.fromWei(
                                await this.web3.eth.getBalance(tx.from), "ether"),
                            timestamp: new Date(),
                        };

                        let actionMessage = this.handleActionMessage(response.address, response.value);
                        this.tracker.postMessage(
                            actionMessage.content,
                            actionMessage.message,
                            actionMessage.type
                        );
                    }
                }
            } catch (err) {
                console.error(err);
            }
            }, 5000);
        });
    }
}

module.exports = { BalanceTracker : BalanceTracker }