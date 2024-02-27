const { model, Schema } = require('mongoose')

let profileSchema = new Schema({
    Guild: String,
    User: String,
    Points: Number,
})

module.exports = model('profileData', profileSchema)