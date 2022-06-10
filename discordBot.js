const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken, action } = require('./config.json');

class BalanceTrackerBot {
    webhookClient;
    constructor() {
        this.webhookClient = new WebhookClient({
            id: webhookId, 
            token: webhookToken 
        });
    }

    createEmbed(message, type) {
        return new MessageEmbed()
            .setTitle(message)
            .setColor(action[type]);
    }

    postMessage(message, type) {
        this.webhookClient.send({
            content: '',
            username: '',
            avatarURL: 'https://i.imgur.com/AfFp7pu.png',
            embeds: [this.createEmbed(message, type)]
        })
    }
}