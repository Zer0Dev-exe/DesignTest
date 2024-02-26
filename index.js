require('dotenv').config()
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  EmbedBuilder
} = require("discord.js");

const { loadEvents } = require("./Handlers/cargarEventos");
const { loadCommands } = require("./Handlers/cargarComandos");
const process = require('node:process');
const token = process.env.TOKEN;
process.on('unhandledRejection', async (reason, promise) => {
console.log('Unhandled Rejection error at:', promise, 'reason', reason);
})
process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception', err);
})
process.on('uncaughtExceptionMonitor', (err, origin) => {
  console.log('Uncaught Exception Monitor', err, origin);
})
const client = new Client({
  intents: [Object.keys(GatewayIntentBits)],
  partials: [Object.keys(Partials)],
  allowedMentions: {
      parse: ["users"]
    },
});
client.commands = new Collection();

  setInterval(async function(){
    const fetch = require("node-fetch")

    let user = "Zer0_AcesitoYT"

    const uptime = await fetch.get(`https://decapi.me/twitch/uptime/${user}`)
    const avatar = await fetch.get(`https://decapi.me/twitch/avatar/${user}`)
    const viewers = await fetch.get(`https://decapi.me/twitch/viewercount/${user}`)
    const title = await fetch.get(`https://decapi.me/twitch/title/${user}`)

    const twitch = require('./Schemas/twitchSchema.js')
    let data = await twitch.findOne({ titulo: title.body })

    if(uptime.body !== `${user} is offline`) {
      if(!data) {
        const nuevaData = twitch({
          titulo: title.body,
        })

        return await nuevaData.save()
      }

      const embed = new EmbedBuilder()
      .setAuthor({ name: `${user}`, iconURL: `${avatar.body}` })
      .setTitle(`${title.body}`)
      .setThumbnail(`${avatar.body}`)
      .setURL(`https://www.twitch.tv/${user}`)
      .addFields(
        { name: `Juego`, value: `${game.body}`, inline: true },
        { name: `Espectadores`, value: `${viewers.body}`, inline: true },
      )
      .setImage(`https://static-cdn.jtvnw.net/previews-ttv/live_user_${user}-620x378.jpg`)
      .setColor("Blurple")

      if(!data) {
        const nuevaData = new twitch({
          titulo: title.body
        })

        await client.channels.cache.get('121161740558587423').send({ content: `${user} Está en directo! https://twitch.tv/${user}`, embeds: [embed]})

        return await nuevaData.save()
      }

      if(data.titulo === title.body) return;

      await client.channels.cache.get('121161740558587423').send({ content: `${user} Está en directo! https://twitch.tv/${user}`, embeds: [embed]})

      await twitch.findOneAndUpdate({ titulo: data.title }, { titulo: title.body })
    }
  }, 10000)

client.login(token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
module.exports = client;