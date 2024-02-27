const { CommandInteraction, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, ChannelType, PermissionsBitField } = require("discord.js");
var timeout = []
const schema = require('../../Schemas/submitSchema')

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
    else if (interaction.isButton()) {
      //Vote one
      if(interaction.customId === 'vote-one') {
        await interaction.deferReply({ ephemeral: true })
        const data = await schema.findOne({ Message: interaction.message.id })
        const member = await interaction.member.id
        if(data.Voters2.includes(member)) {

          data.Voters2.splice(data.Voters2.indexOf(interaction.user.id), 1)
          data.Voters1.push(member)
          data.Votes2 = data.Votes2 -1
          data.Votes1 = data.Votes1 +1
          data.save()

          const msg = await interaction.channel.messages.fetch(data.Message)
          const botones = new ActionRowBuilder()
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1️⃣')
            .setLabel(`${data.Votes1}`)
            .setCustomId('vote-one')
          )
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('2️⃣')
            .setLabel(`${data.Votes2}`)
            .setCustomId('vote-two')  
          )
          await msg.edit({ components: [botones] })
          await interaction.editReply({ content: 'You have changed your vote, instead of voting for the second design now you are voting for the first design!'})

        } else if(!data.Voters1.includes(member)) {

          data.Voters1.push(interaction.user.id)
          data.Votes1 = data.Votes1 + 1
          data.save()

          const msg = await interaction.channel.messages.fetch(data.Message)
          const botones = new ActionRowBuilder()
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1️⃣')
            .setLabel(`${data.Votes1}`)
            .setCustomId('vote-one'),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('2️⃣')
            .setLabel(`${data.Votes2}`)
            .setCustomId('vote-two')  
          )
          await msg.edit({ components: [botones] })
          await interaction.editReply({ content: 'You have voted for the first design! Thanks for voting and helping us grow'})

        } else if(data.Voters1.includes(member)) {

          await interaction.editReply({ content: 'You have voted for this design before, if you wanna switch the vote just click in the other button.'})
        } else {
          await interaction.editReply({ content: 'Ping @zer0dev in chat if this message appeared to you.'})
        }
        
      } else if(interaction.customId === 'vote-two') {

        await interaction.deferReply({ ephemeral: true })
        const data = await schema.findOne({ Message: interaction.message.id })
        const member = await interaction.member.id
        if(data.Voters1.includes(member)) {

          data.Voters1.splice(data.Voters1.indexOf(interaction.user.id), 1)
          data.Voters2.push(member)
          data.Votes1 = data.Votes1 -1
          data.Votes2 = data.Votes2 +1
          data.save()

          const msg = await interaction.channel.messages.fetch(data.Message)
          const botones = new ActionRowBuilder()
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1️⃣')
            .setLabel(`${data.Votes1}`)
            .setCustomId('vote-one')
          )
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('2️⃣')
            .setLabel(`${data.Votes2}`)
            .setCustomId('vote-two')  
          )

          await msg.edit({ components: [botones] })
          await interaction.editReply({ content: 'Now you are voting for the second design, you have changed the first design vote to the second design.'})

        } else if(!data.Voters2.includes(member)) {

          data.Voters2.push(interaction.user.id)
          data.Votes2 = data.Votes2 + 1
          data.save()

          const msg = await interaction.channel.messages.fetch(data.Message)
          const botones = new ActionRowBuilder()
          .addComponents(
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('1️⃣')
            .setLabel(`${data.Votes1}`)
            .setCustomId('vote-one'),
          new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setEmoji('2️⃣')
            .setLabel(`${data.Votes2}`)
            .setCustomId('vote-two')  
          )
          await msg.edit({ components: [botones] })
          await interaction.editReply({ content: 'You have voted for the first design! Thanks for voting and helping us grow'})

        } else if(data.Voters2.includes(member)) {

          await interaction.editReply({ content: 'You have voted for this design before, if you wanna switch the vote just click in the other button.'})
        } else {
          await interaction.editReply({ content: 'Ping @zer0dev in chat if this message appeared to you.'})
        }
        
      }
    }
  }
}