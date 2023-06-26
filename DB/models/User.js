const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    chatRooms: {
        type: Array,
        default: []
    }
})

UserSchema.pre('save', async function(){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('users', UserSchema)


module.exports = User