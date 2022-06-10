const { MessageEmbed, WebhookClient } = require('discord.js');
const { webhookId, webhookToken, action } = require('./config.json');


class BalanceTrackerBot {
    webhookClient;
    constructor() {
        this.webhookClient = new WebhookClient({
            id: process.env.DISCORD_HOOK_ID, 
            token: process.env.DISCORD_HOOK_TOKEN
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