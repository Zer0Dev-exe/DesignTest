const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType, ButtonStyle, MessageComponentInteraction } = require('discord.js')
const Schema = require('../../Schemas/submitSchema.js')
const pointsc = require('../../Schemas/profileSchema.js')

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

                const collector = msg.createMessageComponentCollector({
                    componentType: ComponentType.Button,
                    time: 30000,
                })

                collector.on('end', async (collected) => {
                    const data = await Schema.findOne({ Message: msg.id })
                    const botones = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('1️⃣')
                        .setLabel(`${data.Votes1}`)
                        .setCustomId('vote-one')
                        .setDisabled(true)
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji('2️⃣')
                        .setLabel(`${data.Votes2}`)
                        .setCustomId('vote-two')
                        .setDisabled(true)
                    )  
                    await msg.edit({ components: [botones]})

                    if(data.Votes1 > data.Votes2) {
                        const user1 = await pointsc.findOne({ Guild: interaction.guild.id, User: data.User1 })
                        const user2 = await pointsc.findOne({ Guild: interaction.guild.id, User: data.User2 })
                        const points = data.Votes1 - data.Votes2
                        if(user1) {
                            user1.Points = user1.Points +20 + points
                            user1.save()
                        }
                        
                        if(user2) {
                            user2.Points = user2.Points -10
                            user2.save()
                        }

                        if(!user1) {
                            pointsc.create({
                                Guild: interaction.guild.id,
                                User: data.User1,
                                Points: 20 + points,
                            })
                        }

                        if(!user2) {
                            pointsc.create({
                                Guild: interaction.guild.id,
                                User: data.User2,
                                Points: -10,
                            })
                        }
                    }
                    if(data.Votes2 > data.Votes1) {
                        const user1 = await pointsc.findOne({ Guild: interaction.guild.id, User: data.User1 })
                        const user2 = await pointsc.findOne({ Guild: interaction.guild.id, User: data.User2 })
                        if(!user2) {
                            pointsc.create({
                                Guild: interaction.guild.id,
                                User: data.User2,
                                Points: 20,
                            })
                            return;
                        }

                        if(!user1) {
                            pointsc.create({
                                Guild: interaction.guild.id,
                                User: data.User1,
                                Points: -10,
                            })
                            return;
                        }

                        if(user2) {
                            user2.Points = user2.Points +20
                            user2.save()
                        }

                        if(user1) {
                            user1.Points = user1.Points -10
                            user1.save()
                        }
                    }
                })
            } else {
                return;
            }
        }
        
    }
}