import {User} from '../types'
import logger from '../logger'

interface UsersType {
    users: User[],
    
}

const initialState: UsersType = {
    users: []
}

const usersSlice = {
    name: 'users',
    state: initialState,
    actions: {
        addUser: (id:string, username:string): User => {
            const newUser: User = {
                id,
                username,
                loginTimeStamp: Date.now(),
                lastActiveTimeStamp: Date.now(),
                connected: true,
                isTyping: false
            }
            usersSlice.state.users.push(newUser)
            return newUser
        },
        disconnectUser: (id: string): void => {
            usersSlice.state.users = removeFromArray(usersSlice.state.users, id)
        },
        checkUsernameAvailibility: (username:string): boolean => {
           return usersSlice.state.users.filter(user=> user.username === username ).length > 0
        },
        getUsername: (id:string): string => {
            let username:string
            try{
                username = usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].username || 'User'
            }catch(err){
                logger.error(err)
            }
            return username
        },
        setIsTyping: (id:string): void => {
            usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].isTyping = true
            
        },
        unsetIsTyping: (id:string):void => {
            usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].isTyping = false
        }  
    }
}

export const getUsers = () => usersSlice.state.users

export const getUser = (id:string) => usersSlice.state.users.filter(user => user.id === id)

export const {addUser, disconnectUser, checkUsernameAvailibility, getUsername, setIsTyping, unsetIsTyping} = usersSlice.actions

function removeFromArray(arr:User[], id:string) { 
    return arr.filter((user)=>{ return user.id != id; });
}