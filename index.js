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

client.login(token).then(() => {
  loadEvents(client);
  loadCommands(client);
});
module.exports = client;