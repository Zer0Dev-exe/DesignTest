const { model, Schema } = require('mongoose')

let submitSchema = new Schema({
    Guild: String,
    Topic: String,
    User1: String,
    User1Img: String,
    User2: String,
    User2Img: String,
    Voters1: Array,
    Votes1: Number,
    Voters2: Array,
    Votes2: Number,
    Message: String,
    Group: Number,
})

module.exports = model('submitData', submitSchema)