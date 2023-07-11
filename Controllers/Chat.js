const { StatusCodes } = require('http-status-codes')
const Chat = require('../DB/models/Chat')
const User = require('../DB/models/User')
const joi = require('joi')
const { BadRequest, NotFound } = require('../Errors/CustomErrors')
const getAllChats = async (req, res, next) => {
    try{
        const userId = req.userId 
        const chats = await Chat.find({ members: { $in: [userId] } })
        return res.status(StatusCodes.OK).json({chats})
    }catch(err){
        return next(err)
    }
}


const createGroupChat = async (req, res, next) => {
    this.validateBody = function(){
        const joiObject = joi.object({
            members: joi.array().required(),
            groupName: joi.string().required(),
            type: joi.string().valid('group').required()
        })
        const {error, value} = joiObject.validate(req.body)
        if(error) throw error 
        return value 
    }
    try{
        const {members, groupName, type} = this.validateBody()
        const userId = req.userId
        members.push(userId)
        const admins = [userId]
        const group = await Chat.create({type, members, groupName, owner: userId, admins})
        members.map( async (id) => { // get rid of this shit later
            await User.findByIdAndUpdate(id, {$push: {chatRooms: group._id}})
        })
        if(!group) throw new BadRequest("Failed to create a group")
        return res.status(StatusCodes.CREATED).json({msg: 'group has been created'})
    }catch(err){
        return next(err)
    }
}



const createDmChat = async (req, res, next) => {
    this.validateBody = function(){
        const joiObject = joi.object({
            members: joi.array().length(1).required(),
            chatName: joi.array().length(2),
            type: joi.string().valid('dm')
        })
        const {error, value} = joiObject.validate(req.body)
        if(error) throw error
        return value 
    }
    try{
        const { members, chatName, type } = this.validateBody()
        const userId = req.userId 
        members.push(userId)
        const dm = await Chat.create({type, members, chatName})
        members.map(async (id) => {
            await User.findByIdAndUpdate(id, {$push: { chatRooms: dm._id }})
        })
        return res.status(StatusCodes.OK).json({msg: "You have started dm chat"})
    }catch(err){
        return next(err)
    }
}
module.exports = {
    getAllChats,
    createGroupChat,
    createDmChat
}