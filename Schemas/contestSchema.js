const { model, Schema } = require('mongoose')

let contestSchema = new Schema({
    Guild: String,
    Message: String,
    Topic: String,
    User1: String,
    User1Img: String,
    User1Votes: Array,
    User2: String,
    User2Img: String,
    User2Votes: Array,
})

module.exports = model('contestData', contestSchema)