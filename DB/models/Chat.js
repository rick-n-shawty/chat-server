const mongoose = require('mongoose')


const ChatSchema = new mongoose.Schema({
    type: {
        type: String,
        require: true,
        enum: ['group', 'dm']
    },
    groupName: {
        type: String,
        set: function(value){
            if(this.type === 'group'){
                return value 
            }
            return undefined 
        }
    }, 
    chatName: {
        type: [String],
        set: function(value){
            if(this.type === 'dm'){
                return value 
            }
            return undefined 
        }
    }, 
    members: {
        type: [String],
        validate: {
            validator: function(value){
                if(this.type === 'dm'){
                    return value.length <= 2
                }else{
                    return value.length >= 2
                }
            }
        }
    },
    owner: {
        type: mongoose.Types.ObjectId,
        set: function(value){
            if(this.type === 'group'){
                return value 
            }
            return undefined
        }
    },
    admins: {
        type: Array,
        set: function(value){
            if(this.type === 'group'){
                return value 
            }
            return undefined
        }
    }
})


const Chat = mongoose.model('chats', ChatSchema)

module.exports = Chat