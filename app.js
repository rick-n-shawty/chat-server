require('dotenv').config()
const express = require('express')
const port = process.env.PORT || 8080
const cors = require('cors')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server); 
app.use(express.json()) 
app.use(cors({
    origin: '*' 
}))
app.get('/', (req, res) => {
    res.send("Hello world!")
})

io.on('connection', (socket) => {
    console.log('Connected')
    socket.on('message', (msg) => {
        const randomNum = Math.floor(Math.random() * 13)
        socket.emit('message', `Your number is ${randomNum}`)
    })
})

server.listen(port, () => console.log(`server is listening on port ${port}`))