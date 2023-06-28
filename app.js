require('dotenv').config()
const connect = require('./DB/connect')
const express = require('express')
const port = process.env.PORT || 8080
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server); 
const ErrorHandler = require('./Errors/ErrorHandler')
const NotFound = require('./Errors/NotFound' )
const authenticate = require('./middleware/auth')
app.use(express.json()) 
app.use(cors({ 
    origin: '*' 
}))
app.get('/', (req, res) => res.send('Hello World!'))
const AuthRouter = require('./Routes/User')
const RoomsRouter = require('./Routes/Rooms')
const MessageRouter = require('./Routes/Messages')

app.use('/api/v1', AuthRouter)
app.use('/api/v1/rooms', authenticate, RoomsRouter)
app.use('/api/v1/messages', authenticate, MessageRouter)

app.use(ErrorHandler)
app.use(NotFound)

const Room = require('./DB/models/Room')
const Message = require('./DB/models/Messages')
io.on('connection', (socket) => {
    socket.on('joinRoom', async (room) => {
        socket.join(room)
        const roomRecord = await Room.findOne({name: room})
        const messages = await Message.find({roomId: roomRecord._id})
        const numberOfMembers = roomRecord.members.length  
        console.log(roomRecord)
        io.to(room).emit('message', messages)
        console.log(`someone joined the room ${room}`)
    })
    socket.on('leaveRoom', (room) => {
        socket.leave(room)
        console.log(`someone left the room ${room}`)
    })
    socket.on('sendMessage', (room, message) => {
        // io.to(room).emit('message', message)
        console.log(message) 
    })
})

const start = async () => {
    try{
        await connect(process.env.MONGO_URI)
        server.listen(port, () => console.log(`server is listening on port ${port}`))
    }catch(err){
        console.log(err)
    }
}
start()