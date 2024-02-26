const { model, Schema } = require('mongoose')

let twitchSchema = new Schema({
    titulo: String
})

module.exports = model('twitchData', twitchSchema)