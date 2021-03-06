import * as express from 'express';
import * as socketIo from 'socket.io';
import { ChatEvent } from './constants';
import { createServer, Server} from 'http';
import {User, Message} from '../types/types'
import {signIn, sendMessage, handleDisconnect, handleUserIsTyping} from '../Actions'
import {pintIntervalTime} from '../config/config'
import logger from '../logger/logger'

const cors = require('cors');

export class ChatServer {
    public static readonly PORT: number = 8080;
    private _app: express.Application;
    private server: Server;
    private io: SocketIO.Server;
    private port: string | number;

    constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this._app.use(cors());
        this._app.options(cors({origin:'https://wizardly-mccarthy-d0859c.netlify.app/'}));
        this.server = createServer(this._app);
        this.initSocket();
        this.listen();
    }

    private initSocket(): void {
        this.io = socketIo(this.server,{
            pingInterval: pintIntervalTime,
        });
    }

    private listen(): void {
        this.server.listen(this.port, () => {
            logger.info(`Running server on port: ${this.port}`)
        });
        
        this.io.on(ChatEvent.CONNECT, (socket: SocketIO.Socket)=>{
            logger.info(`Client ${socket.id} connected on port: ${this.port}`)

            socket.on(ChatEvent.SIGNIN, (user:User, callback: (s:string)=>void)=>signIn(socket,this.io,user, callback))
            socket.on(ChatEvent.MESSAGE, (message:Message):void=>sendMessage(this.io,socket.id,message))
            socket.on(ChatEvent.DISCONNECT, ():void=>handleDisconnect(this.io,socket.id))
            socket.on(ChatEvent.IDLETIMEOUT, ()=>handleDisconnect(this.io,socket.id,true))
            socket.on(ChatEvent.TYPING, ()=>handleUserIsTyping(this.io,socket.id))
        })

        process.once("SIGTERM", () => {
            this.server.close(() => {
                this.io.close(() => {
                    logger.info('Server shutting down')
                    logger.info('END LOG')
                    process.exit(0);
                });
            });
        });

        process.once("SIGINT", () => {
            this.server.close(() => {
                this.io.close(() => {
                    logger.info('Server shutting down')
                    logger.info('END LOG')
                    process.exit(0);
                });
            });
        });
    }

    get app(): express.Application {
        return this._app;
    }
}

