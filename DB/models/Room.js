const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    members: {
        type: Array,
        require: true
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        require: true
    }
})

const Room = mongoose.model('rooms', RoomSchema)

module.exports = Room