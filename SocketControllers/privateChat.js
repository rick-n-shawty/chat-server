const User = require('../DB/models/User')
const Message = require('../DB/models/Messages')
const jwt = require('jsonwebtoken')
const joi = require('joi')
const joinRoom = async (roomId) => {
    try{
        const messages = await Message.find({roomId}).sort({ createdBy: -1 })
        return messages

    }catch(err){
        console.log(err)
        return false
    }
}
const sendMessage = async (data) => {
    const joiObject = joi.object({
        roomId: joi.string().required(),
        accessToken: joi.string().required(),
        message: joi.string().min(1).required()
    })
    try{
        const {error, value} = joiObject.validate(data)
        if(error) return false 
        const { roomId, accessToken, message } = value
        const { userId, email } = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY) 
        if(!userId) return false 
        else if(!message) return false 
        else if(!roomId) return false 
        const postedMessage = await Message.create({content: message, roomId, senderId: userId, senderName: email})
        const messages = await Message.find({roomId}).sort({ createdBy: -1 }).limit(20)
        return messages
    }catch(err){
        return false 
    }
}

const deleteMessage = async (data) => {
    const joiObject = joi.object({
        messageId: joi.string().required(),
        accessToken: joi.string().required()
    })
    try{
        const { error, value } = joiObject.validate(data)
        if(error) return false 
        const { messageId, accessToken } = value 
        const { userId, email } = jwt.verify(process.env.JWT_ACCESS_KEY)
        if(!userId) return false 
        const message = await Message.findOneAndDelete({ senderId: userId, senderName: email, _id: messageId })
        if(!message) return false 
        return true 
    }catch(err){
        return false 
    }
}


const createChatRoom =  async (data) => {
    const joiObject = joi.object({
        accessToken: joi.string().required(),
        memberId: joi.string().required()
    })
    try{
        const {error, value} = joiObject.validate()
        if(error) return false 
        const { accessToken, memberId } = value
        const { userId, email } = jwt.verify(userId, process.env.JWT_ACCESS_KEY)
        const member = await User.count({_id: memberId}) 
        if(!userId) return false
        else if(!member) return false  
        const members = [userId, memberId]
        const chat = await Room.create({ members })
        if(!chat) return false
        return chat 
    }catch(err){
        console.log(err)
        return false 
    }
}
module.exports = {
    sendMessage,
    deleteMessage,
    createChatRoom,
    joinRoom
}