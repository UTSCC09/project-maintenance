const mongoose  = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        text: true
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
        type: String,
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
        fileGetPath:{
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

const PostSchema = new Schema({
    posterEmail: {
        type: String,
        required: true
    },
    posterUsername: {
        type: String,
        required: true
    },
    acceptorEmail: {
        type: String,
        required: false
    },
    acceptorUsername: {
        type: String,
        required: false
    },
    title: {
        type: String,
        required: true,
        text: true
    },
    content: {
        type: String,
        required: true,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    type: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        required: true
    },
}, { timestamps: true });

const ConversationSchema = new Schema({
    userEmails: {
        type: [String],
        required: true
    },
});
const MessageSchema = new Schema({
    conversationId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', MessageSchema);
const Post = mongoose.model('Post', PostSchema);
const User = mongoose.model('User', UserSchema);

module.exports = {
    User,
    Post,
    Conversation,
    Message,
};