const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Pings the bot'),

    async execute(interaction, client) {
        interaction.reply({ content: `Ping of the bot ${client.ws.ping}ms!`})
    }
}