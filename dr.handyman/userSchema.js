const mongoose  = require('mongoose');
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
    createdAt: String
}
type Del {
    count: Int
}`

const userMutDef = `
    deleteUser(email: String): Del
`

const chatQueryDef = `
    getConvo(_id: String): Conversation
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
    },
    createdAt: {
        type: String,
        required: false
    }
}, { timestamps: true })

const User = mongoose.model('User', UserSchema);

const userMut = {
    async deleteUser (parent, args, context, info){
        const { email } = args
        return User.deleteOne({email: email}).then (result => {
                                    return { count: result.deletedCount }
                                })
                                .catch (err => {
                                    console.error(err)
                                });
    }
}

module.exports = {
    userDefs,
    userMutDef,
    User,
    userMut,
}

