const { MessageEmbed, WebhookClient } = require('discord.js');
const { action } = require('./config.json');

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
            .setColor(type);
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

module.exports = { BalanceTrackerBot: BalanceTrackerBot }