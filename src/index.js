const path = require('path')
const http = require('http')
const express = require('express')
const socktio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io =socktio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection',(socket)=>{
    console.log('New websocket connection!')
    
    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('A new user has joined!')

    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('profanity is not allowed!')
        }
        io.emit('message', message)
        callback()
    })
    socket.on('sendLocation', (coords, callback)=>{
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
        callback()
    })
    socket.on('disconnect',()=>{
        // i used io because the user whose disconnectd not more being
        //part of conversion so we can send this message to all users in chat room!
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})