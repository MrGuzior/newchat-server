import {User} from '../types/types'
import logger from '../logger/logger'

interface UsersType {
    users: User[]
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
            usersSlice.state.users = [...usersSlice.state.users, newUser]
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
                logger.error('Error getting username')
            }
            return username
        },
        setIsTyping: (id:string): void => {
            try{
                usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].isTyping = true
            }catch(err){
                logger.error('Error setting isTyping')
            }
            
        },
        unsetIsTyping: (id:string):void => {
            try{
                usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].isTyping = false
            }catch(err){
                logger.error('Error unsetting isTyping')
            }
        },
        getIsTyping: (id:string):boolean => {
            let isTyping:boolean
            try{
                isTyping = usersSlice.state.users[usersSlice.state.users.findIndex(user => user.id === id)].isTyping
            }catch(err){
                logger.error('Error getting value of isTyping')
            }
            return isTyping
        }
    }
}

export const getUsers = () => usersSlice.state.users

export const getUser = (id:string) => usersSlice.state.users.filter(user => user.id === id)

export const {addUser, disconnectUser, checkUsernameAvailibility, getUsername, setIsTyping, unsetIsTyping, getIsTyping} = usersSlice.actions

function removeFromArray(arr:User[], id:string) { 
    return arr.filter((user)=>{ return user.id != id; });
}