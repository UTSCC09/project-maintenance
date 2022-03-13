const { createServer } = require('http');
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema }  = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { execute, subscribe } = require('graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { ApolloServer, gql, AuthenticationError} = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const { applyMiddleware } = require('graphql-middleware');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const fs = require('fs');
const cookie = require('cookie');

const {workerDataMutDef, workerDataDefs, WorkerData, workerDataMut} = require('./workerDataSchema');
const {userMutDef, userDefs, User, userMut} = require('./userSchema');
const { postMutDef, postDefs, Post, postMut} = require('./postSchema');
const { chatMutDef, chatDefs, Conversation, Message, chatMut } = require('./chatSchema');
const { permissions } = require('./permissions');

const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = "mongodb+srv://Chris:chris@dr-handyman.7i3hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connection, { ssl: true });
const { RedisPubSub } = require('graphql-redis-subscriptions');
const Redis = require('ioredis');

const options = {
  host: "redis-19500.c239.us-east-1-2.ec2.cloud.redislabs.com",
  port: 19500,
  password: "XnWsIUd2TZ4PFZBApx603S1WGBSCZK9R",
  retryStrategy: times => {
    // reconnect after
    return Math.min(times * 50, 2000);
  }
};

const pubsub = new RedisPubSub({
  publisher: new Redis(options),
  subscriber: new Redis(options)
});

const https = require('https');
const PORT = 3000;

var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};


const SESSION_SECRET = 'some secret';
const app = express();
var parseCookie = require('cookie-parser');
const cookieParser = require('cookie-parser');
const e = require('express');
var expressWs = require('express-ws')(app);
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
    sameSite: "none",
  }
})
app.use(sessionMid);

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
          error = new Error('password incorrect');
          done(error, oneuser);
        }
    });
    
  }),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(async (email, done) => {
  const matchingUser = await User.findOne({ email: email});
  done(null, matchingUser);
});

app.use(passport.initialize());
app.use(passport.session());

const typeDefs = gql(`
  # Type Defs
  type AuthPayload {
    user: User
  }
  ` + workerDataDefs 
    + userDefs
    + postDefs
    + chatDefs
    +`

  # Query types
  type Query {
    WorkerData: [WorkerData]
    User: [User]
    currentUser: User
  }

  # Mutation Types
  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(username: String!, email: String!, password: String!): AuthPayload
    logout: Boolean
    `+ workerDataMutDef
     + userMutDef
     + postMutDef
     + chatMutDef
     +`
  }

  type Subscription {
    newUser: User
    getChat(conversationId: String): [Message]
  }
`);

module.exports = {
    WorkerData,
    User,
    Post,
    Conversation,
    Message,
}

const resolvers = {
    Subscription: {
      newUser: {
        subscribe: (parent, args, context) => {
          if (context.email == null)
            throw new Error("");
          else
            return context.pubsub.asyncIterator("NEW_USER")
        }
      },
      getChat: {
        subscribe: (parent, args, context) => {  
          if (context.email == null)
            throw new Error("");
          else{
            const sub_id = args.conversationId + context.email
            return context.pubsub.asyncIterator(sub_id);
          }
        }
      }
    },
    Mutation: {
      login: async (parent, { email, password }, context) => {
        const { user } = await context.authenticate('graphql-local', { email, password });
        await context.login(user);
        context.pubsub.publish("NEW_USER", {
          newUser: user
        })
        return { user }
      },
      logout: (parent, args, context) => context.logout(),
      signup: async (parent, { username, email, password }, context) => {
        const existUser = await User.findOne({ email: email});
        if (existUser) {
          throw new Error('User with email already exists');
        }
        
        const doSignup = () => new Promise((resolve, reject) => {
          bcrypt.genSalt(10, function(err, salt) {
            if (err) reject(Error('salt gen failed'));
            bcrypt.hash(password, salt, async (err, hash) => {
              if (err) reject(Error('hash failed'));
              const newUser = await userMut.addUser(null, {email, username, password: hash}, null, null);
              await context.login(newUser);
              resolve({ user: newUser });
            });
          });
        });
        return await doSignup();
      },
    },

    Query: {
        User: async () => {
          return await User.find();
        },
        WorkerData: () => WorkerData,
        currentUser: (parent, args, context) => context.getUser(),
    },
}

resolvers.Mutation = Object.assign({}, resolvers.Mutation, workerDataMut, userMut, postMut, chatMut);
// resolvers.Mutation = Object.assign({}, resolvers.Mutation, userMut);
// resolvers.Mutation = Object.assign({}, resolvers.Mutation, postMut);
// resolvers.Mutation = Object.assign({}, resolvers.Mutation, chatMut);

const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  }),
  permissions
);

let server;
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
              await serverCleanup.dispose();
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
          })
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
      origin: 'https://studio.apollographql.com'
  }
    server.applyMiddleware({ app, cors });
}
startServer();

// The `listen` method launches a web server.

httpServer.listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
    
});
