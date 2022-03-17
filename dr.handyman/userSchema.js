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
`;

const userQueryDef = `
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
    profilePic: {
        filepath: {
            type: String,
            required: true,
        },
        mimetype: {
            type: String,
            required: true,
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
    createdAt: {
        type: String,
        required: false
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

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
    }
};

module.exports = {
    userDefs,
    userMutDef,
    User,
    userMut,
};

