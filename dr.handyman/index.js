/*jshint esversion: 9 */
  const http = require('http');
  require('dotenv').config();
  const PORT = process.env.PORT;
  const app = require('express')();
  const httpServer = http.createServer(app);
  const Redis = require('ioredis');
  const ws = require('ws');
  // Redis is only available in deployment. 
  const option = {
    host: "redis",
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  };

  // Redis instance for storing user online status and the socket id
  const userStatus = new Redis(option);
  const io = require("socket.io")(httpServer, {
    cors: {
      credentials: true,
      origin: process.env.PROD == 'false' ? ['https://www.drhandyman.me', 'http://localhost:3001'] : ['https://www.drhandyman.me'],
      methods: [ "GET", "POST" ]
    },
    wsEngine: ws.Server,
    transports: ["websocket", 'polling']
  })

  io.on("connection", (socket) => {

    /**
     * caches the socket id of user
     */
    socket.on('login', function(email){
      console.log(email);
      if (email != null)
        userStatus.set(email, socket.id, "EX", 600000);
    })

    /**
     * If the user trying to call exists, send calling information. Otherwise, emit to signal 
     * termination
     */
    socket.on('callEmail', async (data) => {
      userStatus.get(data.email).then((result) => {
        if (io.sockets.sockets.get(result) !== undefined){
          // const user = await User.find({email: data.email});
          io.to(result).emit("incomingCall", {signal: data.signalData, fromId: socket.id, username: data.username})
        }else{
          io.to(socket.id).emit("callEnded", "User not online");
        }
      }).catch((err) => {
        io.to(socket.id).emit("callEnded", "Error when trying to find user");
      });
      
    })

    // Notify caller that the other end has answered
    socket.on("answer", async (data) => {
      io.to(data.toId).emit("answered", { signal: data.signal, id: socket.id , username: data.toUsername});
    })

    // Notify caller that end user turned off video
    socket.on("stopVideo", async (id) => {
      io.to(id).emit("stopVideo", {});
    })

    // Notify caller that end user turned on video
    socket.on("startVideo", async (id) => {
      io.to(id).emit("startVideo", {});
    })

    // Notify caller that end user turned on audio
    socket.on("mute", async (id) => {
      io.to(id).emit("mute", {});
    })

    // Notify caller that end user turned off audio
    socket.on("unmute", async (id) => {
      io.to(id).emit("unmute", {});
    })
    
    // Notify caller that end user ended the call
    socket.on("callEnded", (data)=>{
      io.to(data.id).emit("callEnded", data.reason);
    })

    // Notify end user that the caller is no longer calling. Emits signal if end user not active
    socket.on("cancel", (email) => {
      userStatus.get(email).then((result) => {
        if (io.sockets.sockets.get(result) !== undefined){
          // const user = await User.find({email: data.email});
          io.to(result).emit("cancel", {});
        }else{
          console.log("not online")
          io.to(socket.id).emit("callEnded", "Error when trying to find user");
        }
      }).catch((err) => {
        console.log("not online")
        io.to(socket.id).emit("callEnded", "Error when trying to find user");
      });
    })
  });
  // The `listen` method launches a web server.
  httpServer.listen(PORT, function (err) {
      if (err) console.log(err);
      else console.log("HTTPS server on https://localhost:%s", PORT);
      
  });
// Initialize and start the HTTPS server


