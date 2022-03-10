const { ApolloServer, gql} = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const { makeExecutableSchema } = require('graphql-tools');
const { applyMiddleware } = require('graphql-middleware');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');
const fs = require('fs');
const {workerDataMutDef, workerDataDefs, WorkerData, workerDataMut} = require('./workerDataSchema');
const {userMutDef, userDefs, User, userMut} = require('./userSchema');
const { postMutDef, postDefs, Post, postMut} = require('./postSchema');
const { permissions } = require('./permissions');
const mongoose = require('mongoose');
const { graphql } = require('graphql');
const { Schema } = mongoose;
const connection = "mongodb+srv://Chris:chris@dr-handyman.7i3hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connection);

const SESSION_SECRET = 'some secret';

const app = express();

app.use(session({
  genid: (req) => uuid(),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 360000,
    secure: true,
    httpOnly: true,
    sameSite: true,
  }
}));

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
  done(null, user.email);
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
     +`
  }
`);

module.exports = {
    WorkerData,
    User,
    Post,
}

const resolvers = {
    Mutation: {
      login: async (parent, { email, password }, context) => {
        const { user } = await context.authenticate('graphql-local', { email, password });
        await context.login(user);
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

resolvers.Mutation = Object.assign({}, resolvers.Mutation, workerDataMut);
resolvers.Mutation = Object.assign({}, resolvers.Mutation, userMut);
resolvers.Mutation = Object.assign({}, resolvers.Mutation, postMut);
const schema = applyMiddleware(
  makeExecutableSchema({
    typeDefs,
    resolvers
  }),
  permissions
);
async function startServer() {
    server = new ApolloServer({
        schema,
        typeDefs, 
        resolvers,
        introspection: true,
        playground: {
          settings: {
            "request.credentials": "include"
          }
        },
        
        context: ({ req, res }) => buildContext({ req, res }),
    });
    await server.start();
    server.applyMiddleware({ app });
}
startServer();

// The `listen` method launches a web server.
const https = require('https');
const PORT = 3000;

var privateKey = fs.readFileSync( 'server.key' );
var certificate = fs.readFileSync( 'server.crt' );
var config = {
        key: privateKey,
        cert: certificate
};

https.createServer(config, app).listen(PORT, function (err) {
    if (err) console.log(err);
    else console.log("HTTPS server on https://localhost:%s", PORT);
});
