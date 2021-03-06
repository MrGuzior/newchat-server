import {User, Message} from '../types/types'
import {
    getUsers,
    addUser,
    disconnectUser, 
    checkUsernameAvailibility, 
    getUsername, 
    setIsTyping, 
    unsetIsTyping, 
    getIsTyping
} from '../Users'
import {isTypingTimeoutTime} from '../config/config'
import logger from '../logger/logger'

export const signIn = (socket:SocketIO.Socket,io:SocketIO.Server,user:User, callback: (s:string, users:User[]|null)=>void)=>{
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
        logger.info(`Client ${socket.id} signin in as ${user.username}`)
   }else{
       callback('409', null)
       logger.info(`Client ${socket.id} failed to sign in (No repeating usernames)`)
    }  
}

export const sendMessage = (io: SocketIO.Server,id:string, message: Message): void => {
    if(message.message !== ''){
        unsetIsTyping(id)
        io.emit('userList', getUsers())
        io.emit('message', message)
        logger.info(`Client ${message.username} said ${message.message}`)
    }
}

export const handleDisconnect = (io:SocketIO.Server,id: string, timeout:boolean = false): void => {
    const username:string = getUsername(id)
    if(username){
        io.emit('message',{
            id: 123,
            username: 'Server',
            message: `${username} ${timeout ? 'was idle too long ' : 'left the chat'}`,
            timeStamp: Date.now(),
        })
        disconnectUser(id)
        io.emit('userList', getUsers())
        logger.info(`Client ${username} ${timeout ? 'was idle too long' : 'left the chat'}`)
    }
}

export const handleUserIsTyping = (io:SocketIO.Server, id: string): void => {
    const userTyping = getIsTyping(id)
    if(!userTyping){
        setIsTyping(id)
        io.emit('userList', getUsers())
        setTimeout(()=>{
            unsetIsTyping(id)
            io.emit('userList', getUsers())
        },isTypingTimeoutTime)
    }
}
