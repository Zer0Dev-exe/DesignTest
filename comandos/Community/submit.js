const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
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
        const voteChannel = await client.channels.cache.get('1208236913811783711')

        await interaction.deferReply({ ephemeral: true })
        if(!data) {

            await Schema.create({
                Guild: interaction.guild.id,
                Topic: topic,
                User1: interaction.user.id,
                User1Img: image,
                Group: 1,
                Votes1: 0,
                Votes2: 0,
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
            //if(data.User1 === interaction.user.id) return interaction.editReply({ content: 'You have already sent with this topic'})

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
        
                await interaction.editReply({ content: 'Thanks for participating in our events! Your submission has been sent into the channel', ephemeral: true})
                await canal.send({ embeds: [embed]})

                const user1 = await interaction.guild.members.fetch(data.User1)
                const user2 = await interaction.guild.members.fetch(data.User2)

                const initialEmbed = new EmbedBuilder()
                .setTitle(`# Style / Task: ${data.Topic}`)

                const embed1 = new EmbedBuilder()
                .setAuthor({ name: `${user1.user.username}`, iconURL: `${user1.user.avatarURL()}`})
                .setColor('Random')
                .setImage(`${data.User1Img}`)

                const embed2 = new EmbedBuilder()
                .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.avatarURL()}`})
                .setColor('Random')
                .setImage(`${image}`)

                const embedFinal = new EmbedBuilder()
                .setTitle('Vote for your favourite designer')

                const botones = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('1️⃣')
                    .setLabel('0')
                    .setCustomId('vote-one')
                )
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji('2️⃣')
                    .setLabel('0')
                    .setCustomId('vote-two')
                )
                const msg = await voteChannel.send({ embeds: [initialEmbed, embed1, embed2, embedFinal], components: [botones]})
                data.Message = msg.id
                await data.save()
            } else {
                return;
            }
        }
        
    }
}