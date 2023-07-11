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
// const RoomsRouter = require('./Routes/Rooms')
// const GroupsRouter = require('./Routes/Groups')
const ChatRouter = require('./Routes/Chat')
const jwt = require('jsonwebtoken')

app.use('/api/v1', AuthRouter)
app.use('/api/v1/chats', authenticate, ChatRouter)
// app.use('/api/v1/rooms', authenticate, RoomsRouter)
// app.use('/api/v1/groups', authenticate, GroupsRouter)
app.use(ErrorHandler)
app.use(NotFound)

const { search } = require('./Controllers/search')
const { joinRoom, sendMessage, deleteMessage, createChatRoom } = require('./SocketControllers')
io.on('connection', (socket) => {
    // PERSONAL CHATS  
    socket.on('createRoom', async (data) => {
        try{
            const room = await createChatRoom(data)
            // send a response 
        }catch(err){
            io.to(socket.id).emit('error', 'failed to create a chat room')
        }
    })
    socket.on('joinRoom', async (roomId) => {
        try{     
            socket.join(roomId)
            const messages = await joinRoom(roomId)
            if(!messages){
                throw new Error("Failed to join the group")
            }
            io.to(roomId).emit('message', messages)
        }catch(err){
            io.to(roomId).emit('error', 'could not join the group')
        }
    })
    socket.on('leaveRoom', (roomId) => {
        socket.leave(roomId)
    })
    socket.on('sendPrivateMessage', async (roomId, data) => {
        try{
            const messages = await sendMessage(data)
            io.to(roomId).emit('message', messages) 
        }catch(err){

        }
    })
    socket.on('deletePrivateMessage', async (room, data) => {

    })

    // GROUP CHATS
    socket.on('joinGroup', async (room) => {
        socket.join(room)
    })
    socket.on('leaveGroup', async (room) => {
        socket.leave()
    })
    socket.on('sendGroupMessage', async(room, message) => {

    })


    // SEARCH FUNCTIONALITY 
    socket.on('search', async (message) => {
        const { content, accessToken } = message
        if(!accessToken) {
            // check what is gonna happen if there is no access token 
            return 
        }
        const { userId } = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY)
        const users = await search(content, userId)
        console.log(users)
        socket.emit('message', users)
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