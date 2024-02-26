const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Schema = require('../../Schemas/submitSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check the partipants')
    .addStringOption(option => 
        option
        .setName('string')
        .setDescription('String')
        .setRequired(true)
    ),

    async execute(interaction, client) {

        const string = await interaction.options.getString('string')
        const data = await Schema.findOne({ Topic: string })

        await interaction.reply({ content: `${data.Group} Participants`})
    }
}