/*jshint esversion: 8 */

// Apollo Graphql Imports
  const { WebSocketServer } = require('ws');
  const { execute, subscribe } = require('graphql');
  const { useServer } = require('graphql-ws/lib/use/ws');
  const { ApolloServer, gql } = require('apollo-server-express');
  const { SubscriptionServer } = require('subscriptions-transport-ws');
  const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
  const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core"); 
// Apollo Graphql Imports

// Schema and authorization imports
  const { 
    schema,
    WorkerData,
    User,
    Post,
    Conversation,
    Message,
    Appointment,
    Comment,
  } = require('./graphqlSchema');
// Schema and authorization imports

require('dotenv').config();

// Mongodb configuration
  const mongoose = require('mongoose');
  const connection = process.env.MONGO;
  mongoose.connect(connection, { ssl: true });
// Mongodb configuration

// Redis subscription configuration
  const { RedisPubSub } = require('graphql-redis-subscriptions');
  const Redis = require('ioredis');

  const options = {
    host: "redis-19500.c239.us-east-1-2.ec2.cloud.redislabs.com",
    port: 19500,
    password: process.env.REDIS,
    retryStrategy: times => {
      // reconnect after
      return Math.min(times * 50, 2000);
    }
  };

  const pubsub = new RedisPubSub({
    publisher: new Redis(options),
    subscriber: new Redis(options)
  });
// Redis subscription configuration

// Express X Passport X HTTPS setup
  const fs = require('fs');
  const https = require('https');
  const http = require('http');
  const uuid = require('uuid').v4;
  const bcrypt = require('bcrypt');
  const express = require('express');
  const passport = require('passport');
  const session = require('express-session');
  const { graphqlUploadExpress } = require('graphql-upload');
  const PORT = process.env.PORT;

  var privateKey = fs.readFileSync( 'server.key' );
  var certificate = fs.readFileSync( 'server.crt' );
  var config = {
          key: privateKey,
          cert: certificate
  };

  const SESSION_SECRET = process.env.SECRET;
  const app = express();
  const httpServer = https.createServer(config, app);

  const sessionMid = session({
    genid: (req) => uuid(),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 360000,
      secure: true,
      httpOnly: true,
      sameSite: 'none',
    }
  });
  app.use(sessionMid);

  app.get('/pictures/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email});
    if (!user)
      return res.status(500).end('no such user');

    if (user.profilePic == undefined || !fs.existsSync(__dirname + '/files/pictures/' + req.params.email + '.pic')){
      res.setHeader('Content-Type', '7bit');
      return res.sendFile(__dirname + '/files/pictures/default');
    }
    res.setHeader('Content-Type', user.profilePic.mimetype);
    res.sendFile(user.profilePic.filepath);
  })
  
  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {
      const oneuser = await User.findOne({ email: email});
      const error = oneuser ? null : new Error('no matching user');
      if (error) return done(error, oneuser);
      return await bcrypt.compare(password, oneuser.password, function (err, same){
          if (err) return done(new Error('hash compare incorrect'), oneuser);
          if (same)
            done(error, oneuser);
          else{
            done(new Error('password incorrect'), oneuser);
          }
      });
      
    }),
  );

  passport.serializeUser((user, done) => {
    done(null, user.email);
  });
  passport.deserializeUser(async (email, done) => {
    const matchingUser = await User.findOne({ email: email});
    done(null, matchingUser);
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(graphqlUploadExpress());
// Express X Passport X HTTPS setup
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: [ "GET", "POST" ]
  },
})

// user need to send their email on login
// each user has list of sockets
// if one user openned multiple pages, only one page will be alerted
// var socketList = io.sockets.server.eio.clients;
// if (socketList[user.socketid] === undefined){
const users = {}
io.on("connection", (socket) => {
  socket.emit("me", socket.id)

  socket.on('login', function(email){
    console.log(email);
    if (email != null)
      users[email] = socket.id; 
  })
  socket.on('callEmail', async (data) => {
    if (data.email in users && io.sockets.sockets.get(users[data.email]) !== undefined){
      // const user = await User.find({email: data.email});
      io.to(users[data.email]).emit("incomingCall", {signal: data.signalData, fromId: socket.id, username: data.username})
    }else{
      console.log("not online")
      socket.emit("user not active");
    }
  })

  socket.on("answer", async (data) => {
    io.to(data.toId).emit("answered", { signal: data.signal, id: socket.id , username: data.toUsername});
  })

  socket.on("stopVideo", async (id) => {
    io.to(id).emit("stopVideo", {});
  })
  
  socket.on("startVideo", async (id) => {
    io.to(id).emit("startVideo", {});
  })

  socket.on("mute", async (id) => {
    io.to(id).emit("mute", {});
  })

  socket.on("unmute", async (id) => {
    io.to(id).emit("unmute", {});
  })

  socket.on("callEnded", (id)=>{
    io.to(id).emit("callEnded", {});
  })

  socket.on("reject", (id) => {
      io.to(id).emit("reject", {})
  })
  socket.on("cancel", (email) => {
    if (email in users && io.sockets.sockets.get(users[email]) !== undefined){
      // const user = await User.find({email: data.email});
      io.to(users[email]).emit("cancel", {});
    }else{
      console.log("not online")
      socket.emit("user not active");
    }
  })
})
// Initialize and start the HTTPS server
  async function startServer() {
      // Creating the WebSocket server
    // const wsServer = new WebSocketServer({
    //   // This is the `httpServer` we created in a previous step.
    //   server: httpServer,
    //   // Pass a different path here if your ApolloServer serves at
    //   // a different path.
    //   path: '/graphql',
    // });

    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    // const temp = makeExecutableSchema({
    //   typeDefs,
    //   resolvers
    // });
    // const serverCleanup = useServer({ temp }, wsServer);
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: {
        settings: {
          "request.credentials": "include"
        }
      },
      plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),
    
        // Proper shutdown for the WebSocket server.
        {
          async serverWillStart() {
            return {
              async drainServer() {
                subscriptionServer.close();
              },
            };
          },
        },
      ],
      
      context: ({ req, res }) => buildContext({ req, res, pubsub }),
    });
    const subscriptionServer = SubscriptionServer.create({
        // This is the `schema` we just created.
        schema,
        // These are imported from `graphql`.
        execute,
        subscribe,
        // Providing `onConnect` is the `SubscriptionServer` equivalent to the
        // `context` function in `ApolloServer`. Please [see the docs](https://github.com/apollographql/subscriptions-transport-ws#constructoroptions-socketoptions--socketserver)
        // for more information on this hook.
        async onConnect(
            connectionParams,
            webSocket,
            context
        ) {
          const authSub = () => new Promise((resolve, reject) => {
            sessionMid(webSocket.upgradeReq, {}, () => {
              if (webSocket.upgradeReq.session.passport == undefined)
              {
                resolve({email: null, pubsub});
              }
                
              else resolve ({ email: webSocket.upgradeReq.session.passport.user, pubsub });
            });
          });
          return await authSub();
        },
        onDisconnect(webSocket, context) {
        },
    }, {
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // This `server` is the instance returned from `new ApolloServer`.
        path: server.graphqlPath,
    });
      await server.start();
      const cors = {
        credentials: true,
        // origin: '*',
         origin: ['https://studio.apollographql.com','http://localhost:3000', 'http://localhost:3001']
      };
      server.applyMiddleware({ app, cors });
  }
  startServer();


  // The `listen` method launches a web server.

  httpServer.listen(PORT, function (err) {
      if (err) console.log(err);
      else console.log("HTTPS server on https://localhost:%s", PORT);
      
  });

  

module.exports = {
    WorkerData,
    User,
    Post,
    Conversation,
    Message,
    Appointment,
    Comment
};
// Initialize and start the HTTPS server