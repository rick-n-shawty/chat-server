require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 8080
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server); 
const messages = [] 
app.use(express.json()) 
app.use(cors({ 
    origin: '*' 
}))
app.get('/', (req, res) => {
    res.send("Hello world!")
})

io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        console.log(`message: ${msg}`)
        messages.push({id: socket.id, msg: msg})
        const data = JSON.stringify(messages)
        socket.emit('message', data)
    })
})

server.listen(port, () => console.log(`server is listening on port ${port}`))