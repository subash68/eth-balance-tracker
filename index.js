const Web3 = require("web3");
const CornJob = require('cron').CronJob;
// const BalanceTrackerBot = require('./discordBot');
const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken, action } = require('./config.json');

require("dotenv").config();

class BalanceTrackerBot {
    webhookClient;
    constructor() {
        this.webhookClient = new WebhookClient({
            id: webhookId, 
            token: webhookToken 
        });
    }

    createEmbed(message, type) {
        console.log(action[type]);
        return new MessageEmbed()
            .setTitle(message)
            .setColor(action[type]);
    }

    postMessage(content, message, type) {
        this.webhookClient.send({
            content: content,
            username: 'balance tracker',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [this.createEmbed(message, type)]
        })
    }
}

class BalanceTracker {
  web3;
  web3ws;
  account;
  subscription;
  tracker;

  constructor(account, tracker) {
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

    this.account = account.toLowerCase();
    this.tracker = tracker;
  }

  subscribe(topic) {
    this.subscription = this.web3ws.eth.subscribe(topic, (err, res) => {
      if (err) console.error(err);
    });
  }

  async watchBalance() {
      try {
          if(this.account != undefined && this.account != null) {
              let response = {
                    value: this.web3.utils.fromWei(
                        await this.web3.eth.getBalance(this.account), "ether"),
                    timestamp: new Date()
              };

              this.tracker.postMessage(
                  (response.value < 5) ? 'value is less': 'Sufficient value',
                  `Current Balance is ${response.value}`,
                  (response.value < 5) ? 'alert': 'info',
              );
          }
      } catch(err) {
          console.log(err);
      }
  }

  watchTransactions() {
    // console.log("Watching all pending transactions...");
    this.subscription.on("data", (txHash) => {
      setTimeout(async () => {
        try {
          let tx = await this.web3.eth.getTransaction(txHash);
          if (tx != null) {
            if (this.account == tx.from.toLowerCase()) {
                let response = {
                    address: tx.from,
                    value: this.web3.utils.fromWei(
                        await this.web3.eth.getBalance(this.account), "ether"),
                    timestamp: new Date(),
                };

                if(response.value < 5) {
                    this.tracker.postMessage(
                        'Balance is less than 5.', 
                        `Current Balance is ${response.value}`, 
                        'alert',
                    );
                }
            }
          }
        } catch (err) {
          console.error(err);
        }
      }, 5000);
    });
  }
}

let balanceTracker = new BalanceTracker(
    process.env.ACCOUNT,
    new BalanceTrackerBot()
);
balanceTracker.subscribe("pendingTransactions");
balanceTracker.watchTransactions();
new CornJob(
    '1 * * * * *',
    () => {
        balanceTracker.watchBalance();
    }
).start();