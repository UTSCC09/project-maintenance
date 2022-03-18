/*jshint esversion: 9 */

const bcrypt = require('bcrypt');
const { gql } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { makeExecutableSchema }  = require('@graphql-tools/schema');
const { permissions } = require('./permissions');
const { userMutDef, userQueryDef, userDefs, User, userMut, userQuery } = require('./userSchema');
const { postMutDef, postDefs, Post, postMut, postQuery, postQueryDef } = require('./postSchema');
const { workerDataMutDef, workerDataDefs, WorkerData, workerDataMut } = require('./workerDataSchema');
const { chatMutDef, chatQueryDef, chatDefs, Conversation, Message, chatMut, chatQuery } = require('./chatSchema');
const { fileUploadDef, fileUploadMut, fileUploadMutDef, fileUploadQueryDef, fileUploadScalar } = require('./userProfilePicUpload');
async function addUser (parent, args, context, info) {
    const { email, password, username } = args;
    const userObj = new User({
        email, password, username,
        type: "user",
        phone: 123456789,
        rating: 0,
        permissions: []
    });
    return userObj.save()
        .then (result => {
            return { ...result._doc };
        })
        .catch (err => {
            console.error(err);
        });
}

const typeDefs = gql(`
    # Type Defs
    type AuthPayload {
        user: User
    }` + 
    workerDataDefs + 
    userDefs + 
    postDefs + 
    chatDefs +
    fileUploadDef +
    `

    # Query types
    type Query {
        WorkerData: [WorkerData]
        User: [User]
        currentUser: User` + 
        chatQueryDef +
        postQueryDef +
        fileUploadQueryDef +
        userQueryDef +
        `
    }

    # Mutation Types
    type Mutation {
        login(email: String!, password: String!): AuthPayload
        signup(username: String!, email: String!, password: String!): AuthPayload
        logout: Boolean`+ 
        workerDataMutDef + 
        userMutDef + 
        postMutDef + 
        chatMutDef +
        fileUploadMutDef +
        `
    }

    type Subscription {
        newUser: User
        getChat(conversationId: String): [Message]
    }
`
);

const resolvers = {
    Upload: fileUploadScalar.Upload,
    Subscription: {
        newUser: {
            subscribe: (parent, args, context) => {
            if (context.email == null)
                throw new Error("Unauthorized");
            else
                return context.pubsub.asyncIterator("NEW_USER");
            }
        },
        getChat: {
            subscribe: (parent, args, context) => {  
            if (context.email == null)
                throw new Error("Unauthorized");
            else{
                return context.pubsub.asyncIterator(args.conversationId);
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
            });
            return { user };
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
                        const newUser = await addUser(null, {email, username, password: hash}, null, null);
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
};

resolvers.Mutation = Object.assign({}, resolvers.Mutation, workerDataMut, userMut, postMut, chatMut, fileUploadMut);
resolvers.Query = Object.assign({}, resolvers.Query, chatQuery, postQuery, userQuery);
// resolvers = Object.assign({}, resolvers, );
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

module.exports = {
    schema,
    WorkerData,
    User,
    Post,
    Conversation,
    Message,
};
