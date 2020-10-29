export interface User {
    id: string,
    username: string,
    loginTimeStamp: number,
    lastActiveTimeStamp: number,
    connected: boolean,
    isTyping: boolean
}

export interface Message { 
    id?: number,
    username: string,
    message: string,
    timeStamp: number,
}