const mongoose = require('mongoose')

const User = require('../DB/models/User')

const addFriend = async(req, res, next) => {
    try{
        const userId = req.userId
        const { id } = req.body
        const user = await User.findByIdAndUpdate(userId, {$push: { friends: id }})
    }catch(err){
        return next(err)
    }
}


module.exports = addFriend