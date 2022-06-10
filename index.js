const Web3 = require("web3");
const CornJob = require('cron').CronJob;
const { MessageEmbed, WebhookClient } = require('discord.js');
const { action, minimum, message, content } = require('./config.json');

require("dotenv").config();

class BalanceTrackerBot {
    webhookClient;
    constructor() {
        this.webhookClient = new WebhookClient({
            id: process.env.DISCORD_HOOK_ID, 
            token: process.env.DISCORD_HOOK_TOKEN
        });
    }

    createEmbed(message, type) {
        return new MessageEmbed()
            .setTitle(message)
            .setColor(action[type]);
    }

    postMessage(content, message, type) {
        this.webhookClient.send({
            content: content,
            username: process.env.BOT_NAME,
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

  // returns message and content
  handleActionMessage(value) {
    return (value < minimum) ? { 
        message: message["alert"] + value, 
        content: content["alert"],
        type: action["alert"]
    } : { 
        message: message["info"] + value, 
        content: content["info"],
        type: action["info"]
    }
  }

  async watchBalance() {
      try {
          if(this.account != undefined && this.account != null) {
              let response = {
                    value: this.web3.utils.fromWei(
                        await this.web3.eth.getBalance(this.account), "ether"),
                    timestamp: new Date()
              };

              let actionMessage = this.handleActionMessage(response.value);
              this.tracker.postMessage(
                  actionMessage.content,
                  actionMessage.message,
                  actionMessage.type
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

                let actionMessage = this.handleActionMessage(response.value);
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

let balanceTracker = new BalanceTracker(
    process.env.ACCOUNT,
    new BalanceTrackerBot()
);
balanceTracker.subscribe("pendingTransactions");
balanceTracker.watchTransactions();
new CornJob(
    '* 9 * * * *',
    () => {
        balanceTracker.watchBalance();
    }
).start();