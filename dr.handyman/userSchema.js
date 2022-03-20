/*jshint esversion: 8 */

const mongoose  = require('mongoose');
const { Message, Post, User } = require('./mongooseSchemas');
const { Schema } = mongoose;

const userDefs = `
input UserInput {
    type: String
    phone: Int
    rating: Int
    permissions: [String]
}
type User {
    email: String
    username: String
    password: String
    type: String
    phone: String
    rating: Int
    location: [Float!]
    profilePic: File
    permissions: [String]
    createdAt: String
}
type Del {
    count: Int
}`;

const userMutDef = `
    deleteUser(email: String): Del
    setUser(username: String!, phone: String!): Boolean
    setWorker(coordinates: [Float!]): Boolean
`;

const userQueryDef = `
    getOneUser(email: String!): User
    getOneWorker(email: String!): User
    getWorkerCount: Int
    getWorkerPage(workerPerPage: Int!, page: Int!): [User]

    searchWorkerPage(queryText: String!, workerPerPage: Int!, page: Int!): [User]
    searchWorkerPageCount(queryText: String!): Int
`;

const userQuery = {
    async getWorkerPage(parent, args, context, info){
        const { workerPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];
        return await User.find({ type: "worker" }).sort({ 'createdAt': 1 }).skip(page * workerPerPage).limit(workerPerPage);
    },
    async getWorkerCount(parent, args, context, info){
        return await User.countDocuments({ type: "worker" });
    },
    async getOneWorker(parent, args, context, info){
        const worker = await User.findOne({$and : [
            {email: args.email},
            {type: "worker"}   
        ]});
        if (worker == null)
            throw new Error('worker does not exist');
        return worker;
    },
    async getOneUser(parent, args, context, info){
        const user = await User.findOne({email: args.email});
        if (user == null)
            throw new Error('worker does not exist');
        return user;
    },
    async searchWorkerPage(parent, args, content, info){
        const { queryText, workerPerPage, page } = args;
        if (page < 0)
            throw new Error("page number undefined");
        if (workerPerPage == 0)
            return [];
        return await User.find({$and: [{ $text: {$search: queryText } }, 
                                       { type: "worker" }]}).sort({ score: {$meta: "textScore" } }).skip(page * workerPerPage).limit(workerPerPage);
    },
    async searchWorkerPageCount(parent, args, content, info){
        return await User.countDocuments({$and: [{ $text: {$search: args.queryText } }, 
            { type: "worker" }]});
    }

};

const userMut = {
    async deleteUser (parent, args, context, info){
        const { email } = args;
        return User.deleteOne({email: email}).then (result => {
                                    return { count: result.deletedCount };
                                })
                                .catch (err => {
                                    console.error(err);
                                });
    },
    async setUser (parent, args, context, info){
        const { username, phone } = args;
        let res = await User.updateOne({ email: context.getUser().email },
                                         { phone, username});
        if (!res.acknowledged)
            throw new Error("update failed");
        res = await Message.updateMany({email: context.getUser().email}, 
                                       {username});
        if (!res.acknowledged)
            throw new Error("update failed");

        res = await Post.updateMany({posterEmail: context.getUser().email}, 
                                    {posterUsername: username});
        if (!res.acknowledged)
            throw new Error("update failed");

        res = await Post.updateMany({acceptorEmail: context.getUser().email}, 
                                    {acceptorUsername: username});
        if (!res.acknowledged)
            throw new Error("update failed");
        return res.acknowledged;
    },
    async setWorker (parent, args, context, info){
        const { coordinates } = args;
        const res = await User.updateOne({ email: context.getUser().email },
                                         { $set:
                                            {
                                                type: "worker",
                                                location: {coordinates, type: 'Point'}
                                            }
                                         });
        return res.acknowledged;
    }
};

module.exports = {
    userDefs,
    userQueryDef,
    userMutDef,
    User,
    userMut,
    userQuery
};

