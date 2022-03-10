const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext }= require('graphql-passport');
const uuid = require('uuid').v4;

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
    const users = await User.find();
    const matchingUser = users.find(user => email === user.email && password === user.password);
    const error = matchingUser ? null : new Error('no matching user');
    done(error, matchingUser);
  }),
);


passport.serializeUser((user, done) => {
  done(null, user.email);
});
passport.deserializeUser(async (email, done) => {
  const users = await User.find();
  const matchingUser = users.find(user => user.email === email);
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
  }

  # Mutation Types
  type Mutation {
    login(email: String!, password: String!): AuthPayload
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
    },

    Query: {
        User: async () => {
          return await User.find();
        },
        WorkerData: () => WorkerData,
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
