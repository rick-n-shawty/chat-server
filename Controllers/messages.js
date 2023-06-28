const Room = require('../DB/models/Room')
const User = require('../DB/models/User')
const Message = require('../DB/models/Messages')
const { StatusCodes } = require('http-status-codes')
const { Unauthorized, NotFound } = require('../Errors/CustomErrors')
const postMessage = async (req, res, next) => {
    try{
        const userId = req.userId 
        const { textMessage, roomId } = req.body
        const room = await Room.findById(roomId)
        if(!room) throw new NotFound("room does not exist u idiot")
        else if(!room.members.includes(userId)) throw new Unauthorized("Not allowed to post ny messages here")
        const user = await User.findById(userId, {email: 1})
        const message = await Message.create({senderId: userId, content: textMessage, roomId: roomId, senderName: user.email})
        return res.status(StatusCodes.OK).json({msg: 'message has been sent'})
    }catch(err){
        return next(err)
    }
}

const getAllMessages = async(req, res, next) => {
    try{
        const roomId = req.params.id
        const userId = req.userId 
        const room = await Room.findById(roomId)
        if(!room) throw new NotFound("Room not found")
        else if(!room.members.includes(userId)) throw new Unauthorized('cannot retrieve messages from this group')
        const messages = await Message.find({roomId: roomId})
        return res.status(StatusCodes.OK).json({msg: 'here u go', messages})
    }catch(err){
        return next(err)
    }
}

module.exports = {
    postMessage,
    getAllMessages
}