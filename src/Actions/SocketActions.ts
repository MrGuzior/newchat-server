import {User, Message} from '../types'
import {getUsers, getUser,addUser,disconnectUser, checkUsernameAvailibility, getUsername} from '../Users/users'
import { isObject } from 'util'

export const signIn = (socket:SocketIO.Socket,io:SocketIO.Server,user:User, callback: (s:string, users:User[]|null)=>void)=>{
    console.log(`Client ${user.username} trying to sign in`)
    if(!checkUsernameAvailibility(user.username)){
        io.emit('message', {
            id: 123,
            username: 'Server',
            message: `${user.username} joined the chat`,
            timeStamp: Date.now(),
        })
        addUser(socket.id,user.username)
        callback('200', getUsers())
        io.emit('userList', getUsers())
   }else{callback('409', null)}  
}

export const sendMessage = (io: SocketIO.Server, message: Message): void => {
    console.log(`Client ${message.username} said ${message.message}`)
    io.emit('message', message)
}

export const handleDisconnect = (io:SocketIO.Server,id: string, timeout:boolean = false): void => {
    const username:string = getUsername(id)
   // console.log(`Client ${id} disconnecting`)
    if(username){
        io.emit('message',{
            id: 123,
            username: 'Server',
            message: `${username} ${timeout ? 'was idle too long ' : 'left the chat'}`,
            timeStamp: Date.now(),
        })
        disconnectUser(id)
        io.emit('userList', getUsers())
    }
}

export const handleUserIsTyping = (io:SocketIO.Server, id: string): void => {
    const username:string = getUsername(id)
    if(username){
        io.emit('message',{
            id: 123,
            username: 'Server',
            message: `${username} is typing`,
            timeStamp: Date.now(),
        })
    }
}

export const handlePing = (io:SocketIO.Server, id:string):void => {
    console.log('sending users')
    io.emit('userList', getUsers())
}