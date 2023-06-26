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
app.use(express.json()) 
app.use(cors({ 
    origin: '*' 
}))
app.get('/', (req, res) => {
    res.send("Hello world!")
})



app.use(ErrorHandler)
app.use(NotFound)

io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log(`someone joined the room ${room}`)
    })
    socket.on('leaveRoom', (room) => {
        socket.leave(room)
        console.log(`someone left the room ${room}`)
    })
    socket.on('sendMessage', (room, message) => {
        messages.push({room, id: socket.id, msg: message})
        io.to(room).emit('message', JSON.stringify(messages)) 
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