const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Types.ObjectId,
        require: true 
    },
    senderName: {
        type: String,
        require: true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        require: true
    },
    content: {
        type: String,
        require: true
    }
}, {timestamps: true})

const Message = mongoose.model('messages', MessageSchema)
module.exports = Message