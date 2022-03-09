const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const uuid = require('uuid').v4;

const {workerDataMutDef, workerDataDefs, WorkerData, workerDataMut} = require('./workerDataSchema');
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
}));

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql(`
  # Type Defs
  ` + workerDataDefs 
    + `

  # Query types
  type Query {
    WorkerData: [WorkerData]
  }

  # Mutation Types
  type Mutation {
    `+ workerDataMutDef +`
  }
`);

module.exports = {
    WorkerData,
}

const resolvers = {
    Mutation: {
    },

    Query: {
        WorkerData: () => WorkerData,
    },
}

resolvers.Mutation = Object.assign({}, resolvers.Mutation, workerDataMut)

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
let server = null;
async function startServer() {
    server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
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
