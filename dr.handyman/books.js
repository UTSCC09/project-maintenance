const mongoose = require('./index').mongoose;

const i = 0;
module.exports = {
    i
}
// const { ApolloServer, gql } = require('apollo-server');

// const express = require('express');

// const mongoose = require('mongoose');
// const { Schema } = mongoose;

// const connection = "mongodb+srv://Edison:Edison@dr-handyman.7i3hz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// mongoose.connect(connection);

// const typeDefs = gql`
//   # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

//   # This "Book" type defines the queryable fields for every book in our data source.
//   type Book {
//     title: String
//     author: String
//   }
//   type Person {
//       name: String
//   }

//   # The "Query" type is special: it lists all of the available queries that
//   # clients can execute, along with the return type for each. In this
//   # case, the "books" query returns an array of zero or more Books (defined above).
//   type Query {
//     Book: [Book]
//     Person: [Person]
//   }
//   type Mutation {
//     addBook(title: String, author: String): Book
//     addPerson(name: String): Person
//   }
// `;


// const books = [
//     {
//       title: 'The Awakening',
//       author: 'Kate Chopin',
//     },
//     {
//       title: 'City of Glass',
//       author: 'Paul Auster',
//     },
//   ];
  
// // Resolvers define the technique for fetching the types defined in the
// // schema. This resolver retrieves books from the "books" array above.
//   const BookSchema = new Schema({
//     title: {
//         type: String,
//         required: true
//     },
//     author: {
//         type: String,
//         required: true
//     }
// })

// const PersonSchema = new Schema({
//     name: { type: String, required: true}
// })

// const Person = mongoose.model('Person', PersonSchema);

// const Book = mongoose.model('Book', BookSchema);
// module.exports = {
//     Book,
//     Person
// }

// const resolvers = {
//     Mutation: {
//         addBook (parent, args, context, info) {
//             const { author, title } = args
//             const bookObj = new Book({
//                 author, title
//             })
//             return bookObj.save()
//                 .then (result => {
//                     return { ...result._doc }
//                 })
//                 .catch (err => {
//                     console.error(err)
//                 })
//         },
//         addPerson (parent, args, context, info) {
//             const { name } = args
//             const personObj = new Person({
//                 name
//             })
//             return personObj.save()
//                 .then (result => {
//                     return { ...result._doc }
//                 })
//                 .catch (err => {
//                     console.error(err)
//                 })
//         }
//     },

//     Query: {
//         Book: () => Book,
//         Person: () => Person
//       },
// }

// // The ApolloServer constructor requires two parameters: your schema
// // definition and your set of resolvers.
// const server = new ApolloServer({ typeDefs, resolvers });

// // The `listen` method launches a web server.
// server.listen().then(({ url }) => {
//   console.log(`🚀  Server ready at ${url}`);
// });
