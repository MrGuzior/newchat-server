# New Chat (SaltChat)

[Live version](https://wizardly-mccarthy-d0859c.netlify.app/) _Might take a minute for the server to wake up_

[Client github repository](https://github.com/MrGuzior/newchat-client)

A chat app for browser desktop use (Not optimized for mobile screens). Server is written in TypeScript Node enviroment using Express and Socket.IO.

## Install and Run

Clone and install its dependencies:

```bash
git@github.com:MrGuzior/newchat-server.git
cd newchat-server
npm i
```

To run the server in development mode, use:

```bash
npm run dev
```

To run the server in production mode, use:

```bash
npm start
```

## Test

No tests are provided for this application as for today.

## Project Structure

All the code is located in the src directory. The file server.ts instantiates the express server that is defined in the file ChatServer.ts inside chat folder. The folder structure inside src directory is as followes:

- Actions: contains functions that are triggered within ChatServer upon incoming socket emit
- chat: contains the ChatServer class and all the emit constants
- logger: contains the setup for winston logger
- types: contains type interfaces
- Users: contains the reducer for Users type

