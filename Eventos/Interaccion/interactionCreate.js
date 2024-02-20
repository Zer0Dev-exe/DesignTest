const { CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ChannelType, PermissionsBitField } = require("discord.js");
var timeout = []

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) {

        return interaction.reply({ content: "All commands are not running, ping @zer0dev" })
      }
      else {
      }
      command.execute(interaction, client);
//
//
//
//INFO TICKETS
    }
    else if (interaction.isSelectMenu()) { // Changed here

      
      
    }   
    else if (interaction.isButton()) { // Changed here
    }
  }
}