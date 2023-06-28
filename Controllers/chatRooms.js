const Room = require('../DB/models/Room')
const joi = require('joi')
const { StatusCodes } = require('http-status-codes')
const User = require('../DB/models/User')
const {BadRequest, Unauthorized, NotFound} = require('../Errors/CustomErrors')

const validateCreateRoom = (body) => {
    try{
        const joiSchema = joi.object({
            name: joi.string().required(),
            members: joi.array().items(joi.string())
        })
        const {error, value} = joiSchema.validate(body)
        if(error) throw error 
        return value 
    }catch(err){
        throw err 
    }
}

const createChatRoom = async (req, res, next) => {
    const userId = req.userId
    try{
        const {name, members} = validateCreateRoom(req.body)
        members.push(userId)
        const room = await Room.create({ name, members, createdBy: userId })
        if(!room) throw new BadRequest("Something went wrong")
        for(const personId of members){
            const updatedUser = await User.findByIdAndUpdate(personId, {$push: { chatRooms: room._id }}, {projection: {chatRooms: 1}})
        }
        return res.status(StatusCodes.CREATED).json({msg: 'room has been created successfuly'})
    }catch(err){
        return next(err)
    }
}

const deleteChatRoom = async (req, res, next) => {
    try{
        const roomId = req.params.id 
        const userId = req.userId 
        const room = await Room.findOneAndDelete({ _id: roomId, createdBy: userId })
        if(!room) throw new BadRequest("something went wrong")
        return res.status(StatusCodes.OK).json({msg: 'room has been deleted successfuly'})
    }catch(err){
        return next(err)
    }
}
const getAllRooms = async (req, res, next) => {
    try{
        const userId = req.userId
        const chatRooms = await Room.find({ members: { $in: [userId] } } )
        return res.status(StatusCodes.OK).json({msg: 'here are all of your rooms', chatRooms})
    }catch(err){
        return next(err)
    }
}

const getRoom = async (req, res, next) => {
    try{
        const roomId = req.params.id 
        const userId = req.userId 
        const room = await Room.findById(roomId)
        if(!room.members.includes(userId)) throw new Unauthorized('you are not the memeber of this group')
        else if(!room) throw new NotFound("Room not found")
        return res.status(StatusCodes.OK).json({msg: 'here is your room', room})
    }catch(err){
        return next(err)
    }
}



module.exports = {
    createChatRoom, 
    deleteChatRoom,
    getAllRooms,
    getRoom
}