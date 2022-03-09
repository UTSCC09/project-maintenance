const { ApolloServer, gql } = require('apollo-server');

const express = require('express');
const {workerDataMutDef, workerDataDefs, WorkerData, workerDataMut} = require('./workerDataSchema');
const mongoose = require('mongoose');
const { Schema } = mongoose;
const connection = "mongodb+srv://Chris:chris@dr-handyman.7i3hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(connection);

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
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
