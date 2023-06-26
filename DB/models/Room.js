const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    members: {
        type: Array
    }, 
    messages: {
        type: Array
    }
})

const Room = mongoose.model('rooms', RoomSchema)

module.exports = Room