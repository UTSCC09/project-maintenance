const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
const uuid = require('uuid').v4;
const bcrypt = require('bcrypt');

const {workerDataMutDef, workerDataDefs, WorkerData, workerDataMut} = require('./workerDataSchema');
const {userMutDef, userDefs, User, userMut} = require('./userSchema');
const mongoose = require('mongoose');
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
    secure: false // this should be true only when you don't want to show it for security reason
  }
}));

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const oneuser = await User.findOne({ email: email});
    const error = oneuser ? null : new Error('no matching user');
    if (error) return done(error, oneuser);
    const doCheck = () => new Promise((resolve, reject) => {
      bcrypt.compare(password, oneuser.password, function (err, same){
        if (error) return done(new Error('hash compare incorrect'), oneuser);
        if (same)
          done(error, oneuser);
        else{
          error = new Error('password incorrect');
          done(error, oneuser);
        }
        resolve();
      });
    });
    return await doCheck();
    
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
     +`
  }
`);

module.exports = {
    WorkerData,
    User,
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
            if (err) throw new Error('salt gen failed');
            bcrypt.hash(password, salt, async (err, hash) => {
              if (err) throw new Error('hash failed');
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

let server = null;
async function startServer() {
    server = new ApolloServer({
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
app.listen(3000, function () {
  console.log(`server running on port 3000`);
  console.log(`gql path is localhost:3000${server.graphqlPath}`);
});
