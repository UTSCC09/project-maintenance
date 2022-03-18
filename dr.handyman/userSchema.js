/*jshint esversion: 8 */

const mongoose  = require('mongoose');
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
    phone: Int
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
    setUser(user: UserInput!): Boolean
    setWorker(coordinates: [Float!]): Boolean
`;

const userQueryDef = `
    getWorkerCount: Int
    getWorkerPage(workerPerPage: Int!, page: Int!): [User]
`;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: false
          },
          coordinates: {
            type: [Number],
            required: false
          }
    },
    profilePic: {
        filepath: {
            type: String,
            required: false,
        },
        mimetype: {
            type: String,
            required: false,
        },
        encoding: {
            type: String,
            required: false,
        },
        required: false
    },
    permissions: {
        type: [String],
        required: true
    },
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

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
    async setUser (parent, { user }, context, info){
        const { type, phone, rating, permissions } = user;
        const res = await User.updateOne({ email: context.getUser().email },
                                         { type: type == null ? context.getUser().type : type,
                                           phone: phone == null ? context.getUser().phone : phone,
                                           rating: rating == null ? context.getUser().rating : rating,
                                           permissions: permissions == null ? context.getUser().permissions : permissions,});
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

