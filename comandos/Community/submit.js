const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const Schema = require('../../Schemas/submitSchema.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit a image to the contest')
    .addStringOption(option => 
        option 
        .setName('topic')
        .setDescription('The topic of your Design')
        .setRequired(true)
    )
    .addStringOption(option => 
        option
        .setName('image-link')
        .setDescription('The image you want to submit')
        .setRequired(true)
    ),

    async execute(interaction, client) {

        const topic = await interaction.options.getString('topic')
        const image = await interaction.options.getString('image-link')
        const canal = await client.channels.cache.get('1209539667930648677')
        const data = await Schema.findOne({ Topic: topic })

        await interaction.deferReply({ ephemeral: true })
        if(!data) {

            await Schema.create({
                Guild: interaction.guild.id,
                Topic: topic,
                User1: interaction.user.id,
                User1Img: image,
                Group: 1,
            })
            const embed = new EmbedBuilder()
            .setColor('Random')
            .setTitle(`${interaction.user.displayName} has submitted!`)
            .setThumbnail(interaction.user.avatarURL())
            .addFields(
                { name: 'Topic:', value: `${topic}`}
            )
            .setDescription('Thanks for your submition, wait till someone is interested in same topic')
            .setImage(image)
    
            await interaction.editReply({ content: 'Thanks for participating in our events! Your submission has been sent into the channel', ephemeral: true})
            await canal.send({ embeds: [embed]})  
        }

        if(data) {

            if(data.Group == 1) {

                data.User2 = interaction.user.id,
                data.User2Img = image,
                data.Group = data.Group + 1

                await data.save()

                const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${interaction.user.displayName} has joined to the party!`)
                .setThumbnail(interaction.user.avatarURL())
                .addFields(
                    { name: 'Topic:', value: `${topic}`}
                )
                .setDescription('Thanks for your submition, wait till someone is interested in same topic')
                .setImage(image)
        
                await canal.send({ embeds: [embed]})
                await interaction.editReply({ content: 'Thanks for participating in our events! Your submission has been sent into the channel', ephemeral: true})
                
            } else if(data.Group == 2) {

                data.User3 = interaction.user.id,
                data.User3Img = image,
                data.Group = data.Group + 1

                await data.save()

                const embed = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`${interaction.user.displayName} has joined to the party!`)
                .setThumbnail(interaction.user.avatarURL())
                .addFields(
                    { name: 'Topic:', value: `${topic}`}
                )
                .setDescription('Thanks for your submition, wait till someone is interested in same topic')
                .setImage(image)
        
                await interaction.editReply({ content: 'Thanks for participating in our events! Your submission has been sent into the channel', ephemeral: true})
                await canal.send({ embeds: [embed]})
            }
        }
        
    }
}