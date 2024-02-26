require('dotenv').config()
const {Client, ActivityType} = require('discord.js');
const mongoose = require('mongoose')
const mongodbURL = process.env.MONGODBURL;
const wait = require('node:timers/promises').setTimeout;
var colors = require('colors');

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {


        
        await wait(3000);
        await console.log(`[   DZN-READY     ]`.underline.red + " --- Empezando ".red + `  ${client.user.tag}`.red);

        mongoose.set('strictQuery', true)

        mongoose.connect(mongodbURL || '', {
            keepAlive: true,
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        if (mongoose.connect) {
            console.log(`[   DZN-MONGO     ]`.underline.yellow + " --- Corriendo  ".yellow + ` Base de Datos en Funcionamiento`.yellow);
        }
        
        const activities = [
            'Bot'
        ];

        setInterval(() => {
            const status = activities[Math.floor(Math.random() * activities.length)];
            client.user.setPresence({ activities: [{ name: `${status}`, type: ActivityType.Watching}], status: 'idle'});
        }, 50000);
        
    },
};