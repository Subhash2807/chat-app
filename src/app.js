const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessages,genearteLocationMessages} = require('./utils/messages')
const {getUser,getUserInRoom,removeUser,addUser} = require('./utils/users')

const app = express()

const publicDirectory = path.join(__dirname,'../public')
console.log(publicDirectory)
const port = process.env.PORT || 3000
app.use(express.static(publicDirectory))

const server = http.createServer(app)

const io = socketio(server);
// let count =0;

io.on('connection',(socket)=>{

    console.log('new websocket connection')

    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id:socket.id,...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message',generateMessages('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message',generateMessages('Admin',`${user.username} has joined!`))

        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id);

        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback('profanity is not allowed!')
        }

        io.to(user.room).emit('message',generateMessages(user.username,message));
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',genearteLocationMessages(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback();
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
        io.to(user.room).emit('message',generateMessages('Admin',`a ${user.username} is disconnected`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        }
    })
})


server.listen(port,()=>{
    console.log('server is started on port',port);
})