/*jshint esversion: 9 */
/**
 * 
 * Reference numbers:
 * 1. Johannes Kettmann: https://dev.to/jkettmann/password-based-authentication-with-graphql-and-passport-8nd
 * 2. Sentry Express: https://docs.sentry.io/platforms/node/guides/express/
 * 3. Apollo Docs: https://www.apollographql.com/docs/apollo-server/
 * 
 */

// Apollo Graphql Imports
  const { execute, subscribe } = require('graphql');
  const { ApolloServer } = require('apollo-server-express');
  const { SubscriptionServer } = require('subscriptions-transport-ws');
  const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
  const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core"); 
// Apollo Graphql Imports

// Schema and authorization imports
  const { 
    schema,
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
  
  // Redis graphql pubsub instance for messaging 
  const pubsub = new RedisPubSub({
    publisher: new Redis(option),
    subscriber: new Redis(option)
  });
// Redis subscription configuration

// Express X Passport X HTTPS setup
  const fs = require('fs');
  const http = require('http');
  const uuid = require('uuid').v4;
  const bcrypt = require('bcrypt');
  const express = require('express');
  const passport = require('passport');
  const session = require('express-session');
  const { graphqlUploadExpress } = require('graphql-upload');
  
  const PORT = process.env.PORT;
  const SESSION_SECRET = process.env.SECRET;

  const app = express();
  const httpServer = http.createServer(app);

  // Sentry monitoring for express communication
  // Reference Number: 2
  const Sentry = require('@sentry/node');
  const Tracing = require("@sentry/tracing");
  Sentry.init({
    dsn: "https://73fbf33220804aadb06952f71a4fc08b@o1186949.ingest.sentry.io/6306768",
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app }),
      // enable Mongodb tracing
      new Tracing.Integrations.Mongo({
        useMongoose: true // Default: false
      }),
    ],
    tracesSampleRate: 1.0,
  });

  // handlers before any other express handlers 
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  /**
   * Endpoint serving user profile pictures
   */
  app.get('/pictures/:email', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.params.email});
      if (!user)
        return res.status(404).end('no such user');

      if (user.profilePic == undefined || !fs.existsSync(__dirname + '/files/pictures/' + req.params.email + '.pic')){
        res.setHeader('Content-Type', '7bit');
        return res.sendFile(__dirname + '/files/pictures/default');
      }
      res.setHeader('Content-Type', user.profilePic.mimetype);
      res.sendFile(user.profilePic.filepath);

    } catch (e) {
      res.status(500).end('failure in getting user');
    }
  })

  // Sentry error handler before middleware and after express handlers
  app.use(Sentry.Handlers.errorHandler());

  // session cookie definition
  const sessionMid = session({
    genid: (req) => uuid(),
    secret: SESSION_SECRET,
    proxy: true,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
      sameSite: process.env.PROD == 'false' ? 'none' : 'strict',
      httpOnly: true,
      secure:  true,
    }
  });

  app.set('trust proxy', true);
  app.use(sessionMid);

  /**
   * Login strategy for passport. Compares the ssalted hash.
   * Reference Number: 1
   */
  passport.use(
    new GraphQLLocalStrategy(async (email, password, done) => {

      const oneuser = await User.findOne({ email: email});
      const error = oneuser ? null : new Error('no matching user');

      if (error) return done(error, oneuser);
      return bcrypt.compare(password, oneuser.password).then(function (same){
          if (same)
            done(error, oneuser);
          else{
            done(new Error('password incorrect'), oneuser);
          }
      }).catch((err) => {
        done(new Error('hash compare incorrect'), oneuser);
      });
    }),
  );

  // Store user email in session as identifier
  passport.serializeUser((user, done) => {
    done(null, user.email);
  });

  // retrieve user information with identifier
  passport.deserializeUser(async (email, done) => {
    try {
      const matchingUser = await User.findOne({ email: email});
      done(null, matchingUser);
    } catch (e) {
      done(e, null);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(graphqlUploadExpress());
// Express X Passport X HTTPS setup

// Initialize and start the HTTPS server
// Reference Number: 3
  async function startServer() {
    const server = new ApolloServer({
      schema,
      introspection: true,
      playground: process.env.PROD == 'false' ? {
        settings: {
          "request.credentials": "include"
        }
      } : false,
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
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
        schema,
        execute,
        subscribe,
        async onConnect(
            connectionParams,
            webSocket,
            context
        ) {
          // Subscriptions 
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
        server: httpServer,
        path: server.graphqlPath,
    });
      await server.start();
      const cors = {
        credentials: true,
        origin: process.env.PROD == 'false' ? 
        ['https://studio.apollographql.com','http://localhost:3000', 'http://localhost:3001', 'https://www.drhandyman.me'] 
        : ['https://www.drhandyman.me'],
      };
      server.applyMiddleware({ app, cors });
  }
  startServer();

  // The `listen` method launches a web server.
  httpServer.listen(PORT, function (err) {
      if (err) console.log(err);
      else console.log("HTTPS server on https://localhost:%s", PORT);
      
  });
// Initialize and start the HTTPS server

module.exports = {
  User,
  Post,
  Conversation,
  Message,
  Appointment,
  Comment
};

