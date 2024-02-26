const { model, Schema } = require('mongoose')

let submitSchema = new Schema({
    Guild: String,
    Topic: String,
    User1: String,
    User1Img: String,
    User2: String,
    User2Img: String,
    User3: String,
    User3Img: String,
    Group: Number,
})

module.exports = model('submitData', submitSchema)