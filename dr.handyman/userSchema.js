const mongoose  = require('mongoose');
const { permissions } = require('./permissions');
const { Schema } = mongoose;

const userDefs = `
type User {
    email: String
    username: String
    password: String
    type: String
    phone: Int
    rating: Int
    permissions: [String]
}`

const userMutDef = `
addUser(email: String, password: String, username: String): User
    `

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
    permissions: {
        type: [String],
        required: true
    }
})

const User = mongoose.model('User', UserSchema);

const userMut = {
    addUser (parent, args, context, info) {
        const { email, password, username } = args
        const userObj = new User({
            email, password, username,
            type: "user",
            phone: 123456789,
            rating: 0,
            permissions: []
        });
        return userObj.save()
            .then (result => {
                return { ...result._doc }
            })
            .catch (err => {
                console.error(err)
            })
    },
}

module.exports = {
    userDefs,
    userMutDef,
    User,
    userMut,
}

